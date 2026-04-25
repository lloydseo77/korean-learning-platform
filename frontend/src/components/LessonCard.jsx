const LessonCard = ({ lesson, onViewExercises, isCompleted }) => {
  const { missionGoal, title, order, xpReward } = lesson

  return (
    <button
      type="button"
      className={`lesson-card ${isCompleted ? 'completed' : ''}`}
      onClick={() => onViewExercises?.(lesson)}
      aria-label={`Start lesson: ${title}`}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="completion-badge">
          <span className="checkmark">✓</span>
          <span className="xp-earned">{xpReward} XP</span>
        </div>
      )}

      <h2 className="lesson-title">Lesson {order}: {title}</h2>
      
      {missionGoal && (
        <p className="lesson-description">{missionGoal}</p>
      )}
      
      <span className="lesson-card-cta">
        {isCompleted ? 'Replay Lesson' : 'Start Lesson'} →
      </span>
    </button>
  )
}

export default LessonCard
