import { Card, CardContent, CardHeader } from "../ui/card";



export function StakeCard() {
    return (
        <Card>
           
            <CardContent>
                <div className="flex flex-col gap-2">
                    <h1>Stake</h1>
                    <h2>10</h2>
                </div>
            </CardContent>
        </Card>
    )
}