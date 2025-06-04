import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";


interface TaskCardProps {
    id: string,
    description: string;
    completed: boolean;
    createdAt: string;
    dueDate: string;
    stake: number;
    title: string;
    handleCompleteTask: (id: string) => void;
}

export function TaskCard({ id, title, completed, description, createdAt, dueDate, stake, handleCompleteTask }: TaskCardProps) {
    return (
        <Card>
            <CardHeader className="flex">
                <div className="flex flex-col ">
                    <h1 className="text-lg font-bold">{title}</h1>

                </div>
                <Badge variant={completed ? "default" : "destructive"}>
                    { completed ? "Completed" : "Pending"}
                </Badge>

            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                    <p className="text-sm text-muted-foreground">Data criada: {createdAt}</p>
                    <p className="text-sm text-muted-foreground">Data de vencimento: {dueDate}</p>
                </div>
                <Button onClick={() => handleCompleteTask(id)}>Complete Task</Button>
                <span>{stake} ETH</span>
            </CardFooter>
        </Card>
    )
}