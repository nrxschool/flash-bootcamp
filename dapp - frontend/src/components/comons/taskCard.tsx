import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";


interface TaskCardProps {
    title: string;
    description: string;
    createdAt: string;
    dueDate: string;
    stake: number;
}

export function TaskCard({ title, description, createdAt, dueDate, stake }: TaskCardProps) {
    return (
        <Card>
            <CardHeader className="flex">
                <div className="flex flex-col ">
                    <h1 className="text-lg font-bold">{title}</h1>

                </div>
                <Badge variant="default">
                    pendente
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
                <span>{stake} wei</span>
            </CardFooter>
        </Card>
    )
}