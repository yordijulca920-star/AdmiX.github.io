import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { CourseIcon } from "@/components/course/course-icon";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { COURSES } from "@/data/courses";
import { courseStats } from "@/lib/stats/derived";
import { useAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/cursos/")({ component: Cursos });

function Cursos() {
  const topicStats = useAppStore((s) => s.topicStats);

  return (
    <AppFrame>
      <PageHeader title="Cursos" subtitle="Temario de admisión para ingeniería" />
      <div className="stagger-in space-y-3 px-4">
        {COURSES.map((course) => {
          const stats = courseStats({ topicStats }, course.id);
          return (
            <Link key={course.id} to="/cursos/$courseId" params={{ courseId: course.id }}>
              <Card className="flex gap-3 p-4 transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]">
                <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-primary">
                  <CourseIcon id={course.id} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold">{course.name}</p>
                      <p className="text-xs text-muted">{course.topics.length} temas · {stats.accuracy}% aciertos</p>
                    </div>
                    <ChevronRight className="mt-1 size-4 text-subtle" />
                  </div>
                  <Progress className="mt-3" value={stats.progress} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppFrame>
  );
}
