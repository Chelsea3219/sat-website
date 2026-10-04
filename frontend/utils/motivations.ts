export const encouragements = [
    "Keep it up—every question brings you closer to your goal.",
    "Small improvements every day lead to big score increases.",
    "Consistency beats cramming.",
    "Stay focused and trust the process.",
    "Every practice session counts.",
    "One step at a time, one question at a time.",
    "Great things come from steady progress.",
    "You're building confidence with every problem you solve.",
    "Success starts with showing up today.",
    "Keep learning. Keep growing.", 

    "Progress isn't always obvious—but it's always worth it.",
    "Every correct answer strengthens your foundation.",
    "Learning is measured in improvement, not perfection.",
    "Today's effort becomes tomorrow's score.",
    "Each quiz is another opportunity to improve.",
    "Focus on getting a little better than yesterday.",
    "Mastery is built through repetition.",
    "Growth happens one practice session at a time.",
    "Improvement comes from persistence.",
    "Keep building momentum.", 

    "Mistakes are opportunities to learn.",
    "Challenge yourself—growth happens outside your comfort zone.",
    "Don't fear difficult questions. Learn from them.",
    "Every expert started as a beginner.",
    "Confidence comes from preparation.",
    "Your future score is shaped by today's effort.",
    "Learning is a journey, not a race.",
    "Hard questions build stronger skills.",
    "Keep asking questions and keep improving.",
    "Progress comes from practice, not perfection.", 

    "Every mastered topic brings your target score closer.",
    "Practice today, perform confidently on test day.",
    "Your next SAT point starts with your next question.",
    "Strong fundamentals lead to stronger scores.",
    "Focus on understanding, not memorizing.",
    "One more quiz could uncover your next breakthrough.",
    "Success on the SAT starts long before test day.",
    "Each topic you master is another step toward your goal.",
    "Preparation creates confidence.",
    "The best time to improve is now.", 

    "A little practice every day makes a big difference.",
    "Keep your streak alive!",
    "Today's effort makes tomorrow easier.",
    "Small habits create lasting success.",
    "Stay consistent—even 15 minutes helps.",
    "Keep the momentum going.",
    "Consistency is your greatest advantage.",
    "Don't stop now—you've already come this far.",
    "Practice regularly to build lasting confidence.",
    "Your future self will thank you."
]

export function getRandomEncouragments() {
    const index = Math.floor(Math.random() * encouragements.length)
    return encouragements[index]
}