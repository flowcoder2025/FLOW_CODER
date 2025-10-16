import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const techCategories = [
  {
    title: "프론트엔드",
    color: "bg-blue-500",
    techs: ["React", "Vue.js", "Angular", "TypeScript", "Next.js", "Svelte"]
  },
  {
    title: "백엔드",
    color: "bg-green-500",
    techs: ["Node.js", "Python", "Java", "Go", "Rust", "PHP"]
  },
  {
    title: "모바일",
    color: "bg-purple-500",
    techs: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic", "Xamarin"]
  },
  {
    title: "데이터베이스",
    color: "bg-orange-500",
    techs: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase", "Supabase"]
  },
  {
    title: "클라우드",
    color: "bg-indigo-500",
    techs: ["AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Docker"]
  },
  {
    title: "AI/ML",
    color: "bg-pink-500",
    techs: ["TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "LangChain", "Keras"]
  }
];

export function TechStack() {
  return (
    <section id="tech" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            모든 기술 스택을 지원합니다
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            최신 기술부터 검증된 기술까지, 당신이 선호하는 모든 개발 도구와 함께하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            원하는 기술이 없나요?
          </p>
          <button className="text-primary hover:underline font-medium">
            새로운 기술 제안하기 →
          </button>
        </div>
      </div>
    </section>
  );
}
