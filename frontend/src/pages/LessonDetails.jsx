import { useParams, Link } from 'react-router-dom'
import { useLessonsContext } from '../hooks/useLessonsContext'

const LessonDetails = () => {
    const { id } = useParams()
    const { lessons } = useLessonsContext()

    const lesson = lessons.find((lesson) => lesson._id === id)

    if (!lesson) {
        return <div className="status-message">Lesson not found</div>
    }

    return (
        <div className="lesson-details-page">
            <Link to="/lessons" className="back-button">← Back to Lessons</Link>
            <div className="lesson-details">
                <h1 className="lesson-details-title">Lesson {lesson.order}: {lesson.title}</h1>
                <p className="lesson-details-description">{lesson.description}</p>
                {lesson.targetConcept && <p className="lesson-meta"><u>Target Concept:</u> {lesson.targetConcept}</p>}
                {lesson.contexts && lesson.contexts.length > 0 && (
                    <div className="lesson-contexts">
                    <p>Contexts:</p>
                    <ul>
                        {lesson.contexts.map(context => (
                        <li key={context._id}>[{context.register.charAt(0).toUpperCase() + context.register.slice(1)}] {context.name}</li>
                        ))}
                    </ul>
                    </div>
                )}
                <button className="start-exercises-button">Start Exercises →</button>
            </div>
        </div>
    )
}

export default LessonDetails