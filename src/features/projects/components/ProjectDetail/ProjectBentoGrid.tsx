import BentoCard from './BentoCard';
import ProjectActions from './ProjectActions';
import ImpactMetrics from './ImpactMetrics';
import { motion } from 'framer-motion';

const ProjectBentoGrid = ({ project }: any) => {
  const hasCode = !!(project.github && project.github !== '#');
  const hasDoc = !!(project.docUrl && project.docUrl !== '#');
  const hasLive = !!project.liveUrl;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
    >
      {/* Box 1: Overview (Spans 2 columns) */}
      <motion.div variants={item} className="md:col-span-2">
        <BentoCard title="Overview" className="h-full">
          <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
            {project.overview}
          </p>
        </BentoCard>
      </motion.div>

      {/* Box 2: Details (Spans 1 column) */}
      <motion.div variants={item} className="md:col-span-1">
        <BentoCard title="Details" className="h-full">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">Role</div>
              <div className="font-medium text-sm">{project.role}</div>
            </div>
            <div>
              <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">Team</div>
              <div className="font-medium text-sm">{project.team}</div>
            </div>
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">Duration</div>
                <div className="font-medium text-sm">{project.duration}</div>
              </div>
              <div>
                <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">Year</div>
                <div className="font-medium text-sm">{project.year}</div>
              </div>
            </div>
          </div>
        </BentoCard>
      </motion.div>

      {/* Box 3: Actions (Spans 1 column) */}
      <motion.div variants={item} className="md:col-span-1">
        <BentoCard title="Links" className="h-full">
          <ProjectActions project={project} hasCode={hasCode} hasDoc={hasDoc} hasLive={hasLive} />
        </BentoCard>
      </motion.div>

      {/* Box 4: Tech Stack (Spans all 4 columns) */}
      <motion.div variants={item} className="md:col-span-4">
        <BentoCard title="Stack">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs font-mono border border-foreground/10 bg-foreground/5 rounded-full text-foreground/70">
                {tag}
              </span>
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* Box 5: Impact Metrics (If available) */}
      {project.metrics && project.metrics.length > 0 && (
        <motion.div variants={item} className="md:col-span-4">
          <BentoCard title="Impact">
            <ImpactMetrics metrics={project.metrics} />
          </BentoCard>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectBentoGrid;
