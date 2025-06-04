import { Card, CardContent, CardHeader } from "../ui/card";

interface StatusCardProps {
    title: string;
    value: number;
}

export function StatusCard({ title, value }: StatusCardProps) {
  return (
    <Card>
        <CardHeader>
            <h1>{title}</h1>
        </CardHeader>
        <CardContent>
            <h2>{value}</h2>
        </CardContent>
    </Card>
  )
}