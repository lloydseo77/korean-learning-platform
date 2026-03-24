const LessonCard = ({ lesson, onViewExercises }) => {
  const { missionGoal, title, order } = lesson

  return (
    <button
      type="button"
      className="lesson-card"
      onClick={() => onViewExercises?.(lesson)}
      aria-label={`Start lesson: ${title}`}
    >
      <h2 className="lesson-title">Lesson {order}: {title}</h2>
      
      {missionGoal && (
        <p className="lesson-description">{missionGoal}</p>
      )}
      
      <span className="lesson-card-cta">Start Lesson →</span>
    </button>
  )
}

export default LessonCard
