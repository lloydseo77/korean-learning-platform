const LessonCard = ({ lesson, onViewExercises }) => {
  return (
    <button
      type="button"
      className="lesson-card"
      onClick={() => onViewExercises?.(lesson)}
      aria-label={`View exercises for ${lesson.title}`}
    >
      <h2 className="lesson-title">Lesson {lesson.order}: {lesson.title}</h2>
      <p className="lesson-description">{lesson.description}</p>
      {lesson.targetConcept && <p><u>Target Concept: {lesson.targetConcept}</u></p>}
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
      <span className="lesson-card-cta">Get Started →</span>
    </button>
  )
}

export default LessonCard
