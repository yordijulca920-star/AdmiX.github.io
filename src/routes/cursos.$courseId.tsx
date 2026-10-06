import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppFrame } from "@/components/layout/app-frame";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCourse, topicKey } from "@/data/courses";
import { courseStats } from "@/lib/stats/derived";
import { useAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/cursos/$courseId")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId);
  const topicStats = useAppStore((s) => s.topicStats);

  if (!course) {
    return (
      <AppFrame>
        <PageHeader title="Curso" back="/cursos" />
        <p className="px-4 text-sm text-muted">Ese curso no existe.</p>
      </AppFrame>
    );
  }

  const stats = courseStats({ topicStats }, course.id);

  return (
    <AppFrame>
      <PageHeader title={course.name} subtitle={course.description} back="/cursos" />
      <div className="space-y-4 px-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Temas tocados</span>
            <span className="tabular">
              {stats.topicsTouched}/{stats.totalTopics}
            </span>
          </div>
          <Progress className="mt-2" value={stats.progress} />
          <div className="mt-3 flex gap-2">
            <Badge variant="primary">{stats.accuracy}% aciertos</Badge>
            <Badge variant="muted">{stats.attempted} preguntas</Badge>
          </div>
        </Card>

        <Button asChild size="lg" className="w-full">
          <Link to="/practicar" search={{ course: course.id, topic: "mixed" }}>
            Practicar curso completo
          </Link>
        </Button>

        <div className="space-y-2 pb-4">
          {course.topics.map((topic) => {
            const s = topicStats[topicKey(course.id, topic.id)];
            const acc = s && s.attempted ? Math.round((s.correct / s.attempted) * 100) : null;
            return (
              <Link
                key={topic.id}
                to="/practicar"
                search={{ course: course.id, topic: topic.id }}
              >
                <Card className="flex items-center gap-3 p-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{topic.name}</p>
                    <p className="text-xs text-muted">{topic.blurb}</p>
                  </div>
                  {acc !== null ? (
                    <span className="tabular text-xs text-muted">{acc}%</span>
                  ) : (
                    <span className="text-xs text-subtle">Nuevo</span>
                  )}
                  <ChevronRight className="size-4 text-subtle" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}
