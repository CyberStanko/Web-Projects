import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, Calendar, Award, Heart, Languages } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl md:text-2xl text-primary">INFANT STANKO F</div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#experience" className="text-muted-foreground hover:text-primary transition-colors">
                Experience
              </Link>
              <Link href="#education" className="text-muted-foreground hover:text-primary transition-colors">
                Education
              </Link>
              <Link href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
                Skills
              </Link>
              <Link href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-12">
        {/* Hero Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold text-primary">INFANT STANKO F</h1>
            <div className="flex flex-wrap gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Tiruchirappalli</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>9025615730</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>infantstanko2003@gmail.com</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-primary mb-3">Executive Summary</h2>
              <p className="text-foreground">
                I'm a software developer with strong skills in MERN Stack Development and Next.js, along with solid
                experience in Java and Python. I know how to use AI tools effectively to speed up development and
                improve the quality of my work. I've worked on full-stack web projects, building both powerful backends
                and interactive frontends. I'm good at solving problems, working with teams, and creating smart, modern
                solutions. I'm looking to join a forward-thinking team where I can use my skills and passion for tech to
                build great software.
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" size={20} />
                  <span>9025615730</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" size={20} />
                  <span>infantstanko2003@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={20} />
                  <span>Tiruchirappalli</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Experience</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Software Engineer</CardTitle>
                    <CardDescription>NearTechPod</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>15/01/2025 - Till Now</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Working as a Associate Software Developer in this organization and developing website and doing the
                  allocated tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Developer Intern & Coding Trainer Intern</CardTitle>
                    <CardDescription>T4TEQ Software Solutions</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>20/05/24 - 20/09/24</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Taught and mentored students in programming languages such as C, Java, Python, and more.</li>
                  <li>Clarified coding doubts and guided students to strengthen their problem-solving skills.</li>
                  <li>Conducted UI/UX design sessions using tools like Adobe Illustrator, Figma.</li>
                  <li>Collaborated with peers and students, enhancing team coordination and communication skills.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Education</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Electronics and Communication Engineering / B.E</CardTitle>
                    <CardDescription>K. Ramakrishnan College of Engineering</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>2024</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>7.72 CGPA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Higher Secondary School</CardTitle>
                    <CardDescription>Chelammal Matriculation Higher Secondary School</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>2020</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>62%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Senior Secondary Education</CardTitle>
                    <CardDescription>St. James Matriculation Higher Secondary School</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>2018</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>73%</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skills & Courses Section */}
        <section id="skills" className="py-8">
          <Tabs defaultValue="skills">
            <TabsList className="mb-6">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="skills">
              <h2 className="text-3xl font-bold text-primary mb-6">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Core Java Programming",
                  "Python Programming",
                  "C Programming",
                  "SQL",
                  "Mongo DB",
                  "Express JS",
                  "React JS",
                  "Node JS",
                  "Next JS",
                  "Node-RED",
                ].map((skill, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-primary">{skill}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Proficient in {skill} with practical experience in various projects and applications.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="courses">
              <h2 className="text-3xl font-bold text-primary mb-6">Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "MERN STACK DEVELOPMENT (at T4TEQ Software Solutions)",
                  "JAVA Full Stack (by Wipro Talentnext)",
                  "MERN Stack Development (by PrepInsta)",
                  "Core JAVA (at T4TEQ Software Solutions)",
                  "Python (at T4TEQ Software Solutions)",
                  "Advance C (at T4TEQ Software Solutions)",
                  "MY SQL (W3 Schools)",
                  "HTML CSS (at PrepInsta)",
                  "Salesforce Developer Virtual Internship (by Smart Internz)",
                  "Carrier Essential in Software Developer (by Microsoft)",
                ].map((course, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <p>{course}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  IoT based Hospital Management and Patient Caring System [REDIX]
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Developed an IoT-based system to monitor patient presence and vital parameters, with cloud integration
                  for data analysis and automated alerts for threshold breaches; patented this project and also
                  published IEEE paper.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">FARMGROW</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Developed a web application offering a private cloud vault for farmers to securely store personal
                  property details, Claimed Copyright for this project.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">LEGATEE</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Developed a mobile app for beneficiaries to track fund transfers and applied schemes; got selected for
                  the final round in the Smart India Hackathon (SIH) India-level competition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">LIBRARY MODULE</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Module has interface to user and admin access to lend and return for user, add and report for admin.
                  Used Structure for Storage in C and ArrayList in JAVA.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">SimplifAi</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is a web portal for an organization for tracking the attendance, work progress like what are the
                  projects the employee assigned to and what are the tasks they did in it and also salary crediting
                  options are also in this portal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Blog Web App</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  A web app that is used to see the blogs of several user creations and sharing their thoughts and also
                  added authentication with Auth0.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Achievements & Awards</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Award className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p>
                    In NearTechPod out of 25 freshers I'm one of the three members chosen to client side project for
                    working good and completing the tasks on time.
                  </p>
                </li>
                <li className="flex gap-3">
                  <Award className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p>
                    Achieved a perfect score of 600/600 (100%) in the Programming Round of TCS NQT IT and secured an
                    impressive 74.30% overall, demonstrating exceptional technical expertise and strong aptitude skills.
                  </p>
                </li>
                <li className="flex gap-3">
                  <Award className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p>
                    My project IoT based Hospital Management and Patient Caring System [REDIX] filed for patent now it
                    got granted.
                  </p>
                </li>
                <li className="flex gap-3">
                  <Award className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p>
                    Project FARMGROW was projected to The Trichy Collector and he forwarded it to CM CELL and also
                    claimed Copyrights for this project.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Interests & Languages Section */}
        <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Interests</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    "Developing Website or Application",
                    "Learning New Technologies",
                    "Problem Solving",
                    "Environmental adaptability",
                  ].map((interest, index) => (
                    <li key={index} className="flex gap-3">
                      <Heart className="text-primary flex-shrink-0 mt-1" size={18} />
                      <p>{interest}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Languages</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {["Tamil", "English"].map((language, index) => (
                    <li key={index} className="flex gap-3">
                      <Languages className="text-primary flex-shrink-0 mt-1" size={18} />
                      <p>{language}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">© 2025 Infant Stanko F. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="icon">
              <Mail size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone size={20} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
