type ProjectSpec = {
    title: string;
    description: string;
    techStack: readonly string[];
    highlights: readonly string[];
    role: string;
  };
  
  export function ProjectSpecCard({ spec }: { spec: ProjectSpec }) {
    return (
      <div className="spec-card">
        <div className="spec-card__header">
          <span className="spec-card__badge">Project</span>
          <h3 className="spec-card__title">{spec.title}</h3>
        </div>
  
        <p className="spec-card__description">{spec.description}</p>
  
        <div className="spec-card__section">
          <span className="spec-card__label">Tech Stack</span>
          <div className="spec-card__tags">
            {spec.techStack.map((tech) => (
              <span key={tech} className="spec-card__tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
  
        <div className="spec-card__section">
          <span className="spec-card__label">Highlights</span>
          <ul className="spec-card__list">
            {spec.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
  
        <p className="spec-card__role">{spec.role}</p>
      </div>
    );
  }