import { type Day } from "~/types/schedule";
import Lesson from "./lesson";
import DateTime from "~/lib/utils/datetime"
import EmptyDay from "./empty-day";
import { P } from "~/components/ui/typography";
import useActiveLessonId from "../utils/use-active-lesson-id";

interface DayProps {
    day: Day,
    type: 'student' | 'teacher'
}

export default function Day(props: DayProps) {
    const activeLessonId = useActiveLessonId(props.day.lessons)

    return (
        <div className="grid gap-4">


            {!!props.day.lessons.length && props.day.lessons.map((lesson, i) => (
                <Lesson key={i} lesson={lesson} isActive={activeLessonId === lesson.id}
                    type={props.type}
                />
            ))}
        </div>
    )
}