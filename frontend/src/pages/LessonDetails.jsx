import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLessonsContext } from '../hooks/useLessonsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const LessonDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { lessons } = useLessonsContext()
    const { user, token, loading: authLoading } = useAuthContext()
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({}) // Map: pageIndex -> selectedOptionIndex
    const [feedbacks, setFeedbacks] = useState({}) // Map: pageIndex -> feedback object
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [totalXpEarned, setTotalXpEarned] = useState(0)
    const [isLessonComplete, setIsLessonComplete] = useState(false)
    const [completionSubmitting, setCompletionSubmitting] = useState(false)

    // For drag-and-drop matching exercises
    const [draggedPairIndex, setDraggedPairIndex] = useState(null)
    const [matches, setMatches] = useState({}) // Maps right item index -> left item index
    const [matchFeedback, setMatchFeedback] = useState({}) // Feedback for each match

    // For open-ended exercises
    const [openEndedAnswers, setOpenEndedAnswers] = useState({}) // Map: pageIndex -> answer text

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // First, check if lesson is in context
        const contextLesson = lessons.find((lesson) => lesson._id === id)
        
        if (contextLesson) {
            setLesson(contextLesson)
            setLoading(false)
            return
        }

        // Wait for auth to finish loading before fetching
        if (authLoading) {
            return
        }

        // If not in context, fetch directly from API
        const fetchLesson = async () => {
            try {
                const response = await fetch(`${API_URL}/api/lessons/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) throw new Error('Failed to fetch lesson')
                const data = await response.json()
                setLesson(data)
                setError(null)
            } catch (err) {
                console.error('Error fetching lesson:', err)
                setError('Failed to load lesson')
            } finally {
                setLoading(false)
            }
        }

        fetchLesson()
    }, [id, lessons, token, authLoading])

    // Check if lesson is complete and calculate XP
    useEffect(() => {
        if (!lesson || !lesson.pages) return

        // Find all EXERCISE pages with their indices
        const exercisePageIndices = lesson.pages
            .map((page, idx) => ({ page, idx }))
            .filter(({ page }) => page.pageType === 'EXERCISE')
            .map(({ idx }) => idx)

        console.log('Exercise page indices:', exercisePageIndices)
        console.log('Feedbacks state:', feedbacks)

        if (exercisePageIndices.length === 0) {
            console.log('No exercise pages found')
            return
        }

        // Check if all exercises have correct feedback
        const allExercisesComplete = exercisePageIndices.every(
            idx => feedbacks[idx]?.isCorrect === true
        )

        console.log('All exercises complete?', allExercisesComplete)

        if (allExercisesComplete) {
            // Calculate total XP from all correct exercises
            const totalXp = exercisePageIndices.reduce((sum, idx) => {
                return sum + (feedbacks[idx]?.xpEarned || 0)
            }, 0)
            
            console.log('Setting completion with XP:', totalXp)
            setTotalXpEarned(totalXp)
            setIsLessonComplete(true)
        } else {
            setIsLessonComplete(false)
        }
    }, [feedbacks, lesson])

    const handleCompleteLesson = async () => {
        setCompletionSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/api/attempts/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lessonId: lesson._id
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to complete lesson')
            }
            const result = await response.json()
            
            // Navigate back to lessons using React Router
            navigate('/lessons')
        } catch (error) {
            console.error('Error completing lesson:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setCompletionSubmitting(false)
        }
    }

    return (
        <div className="lesson-details-page">
            <Link to="/lessons" className="back-button">← Back to Lessons</Link>
            
            {loading && <div className="status-message">Loading lesson...</div>}
            {error && <div className="status-message error-message">{error}</div>}
            {!loading && !error && !lesson && <div className="status-message">Lesson not found</div>}
            {!loading && lesson && !lesson.pages && <div className="status-message">No pages available for this lesson</div>}
            
            {!loading && lesson && lesson.pages && (() => {
        const currentPage = lesson.pages[currentPageIndex]
        const totalPages = lesson.pages.length

        const handlePrevious = () => {
            if (currentPageIndex > 0) {
                setCurrentPageIndex(currentPageIndex - 1)
            }
        }

        const handleNext = () => {
            if (currentPageIndex < totalPages - 1) {
                setCurrentPageIndex(currentPageIndex + 1)
            }
        }

        const handleOptionClick = async (optionIndex, option) => {
            // Prevent clicking if already submitted for this page
            if (feedbacks[currentPageIndex]) return

            setSelectedAnswers({
                ...selectedAnswers,
                [currentPageIndex]: optionIndex
            })
            setIsSubmitting(true)

            try {
                const response = await fetch(`${API_URL}/api/attempts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lessonId: lesson._id,
                        pageIndex: currentPageIndex,
                        userAnswer: option.text,
                        isCorrect: option.isCorrect
                    })
                })

                const result = await response.json()
                setFeedbacks({
                    ...feedbacks,
                    [currentPageIndex]: {
                        isCorrect: option.isCorrect,
                        message: option.feedback,
                        xpEarned: result.xpEarned || 0
                    }
                })
            } catch (error) {
                console.error('Error submitting attempt:', error)
                setFeedbacks({
                    ...feedbacks,
                    [currentPageIndex]: {
                        isCorrect: false,
                        message: 'Error submitting answer. Please try again.'
                    }
                })
            } finally {
                setIsSubmitting(false)
            }
        }

        const handleTryAgain = () => {
            const newSelectedAnswers = { ...selectedAnswers }
            const newFeedbacks = { ...feedbacks }
            delete newSelectedAnswers[currentPageIndex]
            delete newFeedbacks[currentPageIndex]
            setSelectedAnswers(newSelectedAnswers)
            setFeedbacks(newFeedbacks)
        }

        const handleDragStart = (e, pairIndex) => {
            setDraggedPairIndex(pairIndex)
            e.dataTransfer.effectAllowed = 'move'
        }

        const handleDragOver = (e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
        }

        const handleDropRightItem = async (e, rightItemIndex) => {
            e.preventDefault()
            
            if (draggedPairIndex === null) return

            const leftItem = currentPage.content.pairs[draggedPairIndex]
            const rightItem = currentPage.content.pairs[rightItemIndex]

            // Check if this is a valid match (compare left and right to pairs array)
            const isCorrect = draggedPairIndex === rightItemIndex

            // Send attempt to server
            try {
                const response = await fetch(`${API_URL}/api/attempts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lessonId: lesson._id,
                        pageIndex: currentPageIndex,
                        userAnswer: `${leftItem.left} → ${rightItem.right}`,
                        isCorrect: isCorrect
                    })
                })

                const result = await response.json()

                // Update matches and feedback
                const updatedMatches = {
                    ...matches,
                    [rightItemIndex]: draggedPairIndex
                }
                
                const updatedMatchFeedback = {
                    ...matchFeedback,
                    [rightItemIndex]: {
                        isCorrect: isCorrect,
                        message: isCorrect ? '✓ Correct!' : '✗ Incorrect pair',
                        xpEarned: result.xpEarned || 0
                    }
                }
                
                setMatches(updatedMatches)
                setMatchFeedback(updatedMatchFeedback)

                // Check if all pairs have been matched and all are correct
                const totalPairs = currentPage.content.pairs.length
                const matchedPairs = Object.keys(updatedMatches).length

                if (matchedPairs === totalPairs) {
                    // Check if all matches are correct
                    const allCorrect = Object.values(updatedMatches).every((leftIdx, rightIdx) => 
                        updatedMatchFeedback[rightIdx]?.isCorrect === true
                    )
                    
                    if (allCorrect) {
                        // Calculate total XP for this exercise
                        const totalXp = Object.values(updatedMatchFeedback).reduce((sum, fb) => sum + (fb.xpEarned || 0), 0)
                        
                        // Mark this exercise as complete in feedbacks state
                        setFeedbacks({
                            ...feedbacks,
                            [currentPageIndex]: {
                                isCorrect: true,
                                message: 'Perfect! You matched all pairs correctly!',
                                xpEarned: totalXp
                            }
                        })
                    }
                }
            } catch (error) {
                console.error('Error submitting match:', error)
            } finally {
                setDraggedPairIndex(null)
            }
        }

        const handleClearMatch = (rightItemIndex) => {
            const newMatches = { ...matches }
            const newFeedback = { ...matchFeedback }
            delete newMatches[rightItemIndex]
            delete newFeedback[rightItemIndex]
            setMatches(newMatches)
            setMatchFeedback(newFeedback)
            
            // Clear exercise completion if matches are cleared
            const newFeedbacks = { ...feedbacks }
            delete newFeedbacks[currentPageIndex]
            setFeedbacks(newFeedbacks)
        }

        const handleOpenEndedSubmit = async () => {
            const userAnswer = openEndedAnswers[currentPageIndex]
            
            // Prevent submitting if already submitted or no answer provided
            if (feedbacks[currentPageIndex] || !userAnswer?.trim()) return

            setIsSubmitting(true)

            try {
                // Check if answer matches any acceptable answer (case-insensitive)
                const acceptableAnswers = currentPage.content.acceptableAnswers || []
                const normalizedUserAnswer = userAnswer.trim().toLowerCase()
                const isCorrect = acceptableAnswers.some(
                    answer => answer.toLowerCase() === normalizedUserAnswer
                )

                // Send attempt to server
                const response = await fetch(`${API_URL}/api/attempts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lessonId: lesson._id,
                        pageIndex: currentPageIndex,
                        userAnswer: userAnswer,
                        isCorrect: isCorrect
                    })
                })

                const result = await response.json()

                // Set feedback
                setFeedbacks({
                    ...feedbacks,
                    [currentPageIndex]: {
                        isCorrect: isCorrect,
                        message: isCorrect 
                            ? currentPage.content.characterReaction || '✓ Great job!'
                            : `Try again. Hint: ${currentPage.content.hints?.[0] || 'Check your spelling and formatting'}`,
                        xpEarned: result.xpEarned || 0
                    }
                })
            } catch (error) {
                console.error('Error submitting answer:', error)
                setFeedbacks({
                    ...feedbacks,
                    [currentPageIndex]: {
                        isCorrect: false,
                        message: 'Error submitting answer. Please try again.'
                    }
                })
            } finally {
                setIsSubmitting(false)
            }
        }

        return (
            <>
            {/* Social Context Header */}
            <div className="lesson-header">
                <h1>Lesson {lesson.order}: {lesson.title}</h1>
                {lesson.socialContext && (
                    <div className="social-context">
                        <p><strong>Meeting:</strong> {lesson.socialContext.recipientName} ({lesson.socialContext.recipientRole})</p>
                        <p><strong>Relationship:</strong> {lesson.socialContext.closeness} • {lesson.socialContext.hierarchy}</p>
                        {lesson.missionGoal && <p><strong>Goal:</strong> {lesson.missionGoal}</p>}
                    </div>
                )}
            </div>

            {/* Page Content */}
            <div className="lesson-content">
                {currentPage.pageType === 'INFO' && (
                    <div className="info-page">
                        {currentPage.content.header && (
                            <h2>{currentPage.content.header}</h2>
                        )}
                        {currentPage.content.body && (
                            <p className="info-body">{currentPage.content.body}</p>
                        )}
                        {currentPage.content.examples && currentPage.content.examples.length > 0 && (
                            <div className="examples">
                                <h3>Examples:</h3>
                                {currentPage.content.examples.map((ex, idx) => (
                                    <div key={idx} className="example-pair">
                                        <span className="polite">Polite: {ex.polite}</span>
                                        <span className="casual">Casual: {ex.casual}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {currentPage.content.visualAid && (
                            <img src={currentPage.content.visualAid} alt="Visual aid" className="visual-aid" />
                        )}
                    </div>
                )}

                {currentPage.pageType === 'EXERCISE' && (
                    <div className="exercise-page">
                        <h2>{currentPage.content.question}</h2>
                        
                        {currentPage.content.interactionType === 'MULTIPLE_CHOICE' && (
                            <div className="multiple-choice">
                                {currentPage.content.options?.map((option, idx) => {
                                    const currFeedback = feedbacks[currentPageIndex]
                                    const currSelectedAnswer = selectedAnswers[currentPageIndex]
                                    return (
                                    <button 
                                        key={idx} 
                                        className={`choice-button ${currSelectedAnswer === idx ? 'selected' : ''} ${
                                            currSelectedAnswer === idx && currFeedback?.isCorrect ? 'correct' : ''
                                        } ${
                                            currSelectedAnswer === idx && !currFeedback?.isCorrect ? 'incorrect' : ''
                                        }`}
                                        onClick={() => handleOptionClick(idx, option)}
                                        disabled={!!currFeedback || isSubmitting}
                                    >
                                        {option.text}
                                    </button>
                                    )
                                })}
                                {feedbacks[currentPageIndex] && (
                                    <div className={`feedback ${feedbacks[currentPageIndex].isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                                        <div className="feedback-header">
                                            <strong>{feedbacks[currentPageIndex].isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
                                        </div>
                                        <p>{feedbacks[currentPageIndex].message}</p>
                                        {!feedbacks[currentPageIndex].isCorrect && (
                                            <button onClick={handleTryAgain} className="try-again-button">
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentPage.content.interactionType === 'DRAG_MATCH' && (
                            <div className="drag-match-exercise">
                                <div className="drag-match">
                                    <div className="left-column">
                                        {currentPage.content.pairs?.map((pair, idx) => {
                                            const isMatched = Object.values(matches).includes(idx)
                                            const matchedToRight = Object.entries(matches).find(([_, left]) => left === idx)?.[0]
                                            const isCorrectMatch = matchedToRight !== undefined && matchFeedback[matchedToRight]?.isCorrect
                                            return (
                                                <div
                                                    key={idx}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, idx)}
                                                    className={`left-item ${isCorrectMatch ? 'matched' : ''} ${draggedPairIndex === idx ? 'dragging' : ''}`}
                                                >
                                                    {pair.left}
                                                    {isCorrectMatch && <span className="match-indicator">✓</span>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="right-column">
                                        {currentPage.content.pairs?.map((pair, idx) => {
                                            const leftMatchIdx = matches[idx]
                                            const isMatched = leftMatchIdx !== undefined
                                            return (
                                                <div
                                                    key={idx}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDropRightItem(e, idx)}
                                                    className={`right-item ${isMatched ? (matchFeedback[idx]?.isCorrect ? 'correct-match' : 'incorrect-match') : ''} ${draggedPairIndex !== null ? 'droppable' : ''}`}
                                                >
                                                    <div>{pair.right}</div>
                                                    {isMatched && matchFeedback[idx] && (
                                                        <div className={`match-feedback-mini ${matchFeedback[idx].isCorrect ? 'correct' : 'incorrect'}`}>
                                                            {matchFeedback[idx].isCorrect ? '✓' : '✗'}
                                                            <button
                                                                className="clear-match-btn"
                                                                onClick={() => handleClearMatch(idx)}
                                                                title="Clear this match"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                {Object.keys(matchFeedback).length > 0 && (
                                    <div className="match-summary">
                                        <p className="matches-count">
                                            Matched: {Object.keys(matches).length} / {currentPage.content.pairs.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentPage.content.interactionType === 'OPEN_ENDED' && (
                            <div className="open-ended">
                                <textarea 
                                    placeholder="Type your answer in Korean..." 
                                    className="answer-input"
                                    rows="4"
                                    value={openEndedAnswers[currentPageIndex] || ''}
                                    onChange={(e) => {
                                        // Prevent changes if already submitted
                                        if (feedbacks[currentPageIndex]) return
                                        setOpenEndedAnswers({
                                            ...openEndedAnswers,
                                            [currentPageIndex]: e.target.value
                                        })
                                    }}
                                    disabled={!!feedbacks[currentPageIndex] || isSubmitting}
                                ></textarea>
                                {currentPage.content.hints && currentPage.content.hints.length > 0 && (
                                    <div className="hints">
                                        <p><strong>Hints:</strong></p>
                                        <ul>
                                            {currentPage.content.hints.map((hint, idx) => (
                                                <li key={idx}>{hint}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {feedbacks[currentPageIndex] && (
                                    <div className={`feedback ${feedbacks[currentPageIndex].isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                                        <div className="feedback-header">
                                            <strong>{feedbacks[currentPageIndex].isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
                                        </div>
                                        <p>{feedbacks[currentPageIndex].message}</p>
                                        {!feedbacks[currentPageIndex].isCorrect && (
                                            <button onClick={() => {
                                                const newAnswers = { ...openEndedAnswers }
                                                const newFeedbacks = { ...feedbacks }
                                                delete newAnswers[currentPageIndex]
                                                delete newFeedbacks[currentPageIndex]
                                                setOpenEndedAnswers(newAnswers)
                                                setFeedbacks(newFeedbacks)
                                            }} className="try-again-button">
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                )}
                                {!feedbacks[currentPageIndex] && (
                                    <button 
                                        className="submit-button"
                                        onClick={handleOpenEndedSubmit}
                                        disabled={isSubmitting || !openEndedAnswers[currentPageIndex]?.trim()}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Completion Screen */}
            {isLessonComplete && (
                <div className="lesson-completion-screen">
                    <div className="completion-content">
                        <div className="completion-header">
                            <h2>🎉 Lesson Complete!</h2>
                            <p>Amazing work! You've completed all exercises.</p>
                        </div>
                        <div className="xp-reward">
                            <div className="xp-amount">+{totalXpEarned} XP</div>
                            <p className="xp-label">Experience Points Earned</p>
                        </div>
                        <div className="completion-message">
                            <p>You're making great progress in learning Korean!</p>
                        </div>
                        <button 
                            onClick={handleCompleteLesson}
                            disabled={completionSubmitting}
                            className="completion-button"
                        >
                            {completionSubmitting ? 'Completing...' : 'Continue'}
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation */}
            {!isLessonComplete && (
            <div className="page-navigation">
                <button 
                    onClick={handlePrevious} 
                    disabled={currentPageIndex === 0}
                    className="nav-button"
                >
                    ← Previous
                </button>
                <span className="page-counter">
                    Page {currentPageIndex + 1} of {totalPages}
                </span>
                <button 
                    onClick={handleNext} 
                    disabled={currentPageIndex === totalPages - 1}
                    className="nav-button"
                >
                    Next →
                </button>
            </div>
            )}
            </>
        )
        })()}
        </div>
    )
}

export default LessonDetails