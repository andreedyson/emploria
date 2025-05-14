import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome back, Employee 👋</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">1,024</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total companies</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">17</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">312</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
