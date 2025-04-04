"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import Link from "next/link";

// Skip using recharts components directly
interface ChartData {
  date: string;
  interactions: number;
  apiCalls: number;
}

interface WidgetCard {
  id: string;
  title: string;
  description: string;
  status: "Live" | "Draft";
  interactions: string;
  apiCalls: string;
  startDate: string;
  endDate: string;
  chartData: ChartData[];
}

const SimpleAreaChart = ({
  data,
  height = 100,
  width = "100%",
}: {
  data: ChartData[];
  height?: number;
  width?: string | number;
}) => {
  // Only render if we have valid data
  if (!data || !data.length || !data[0].interactions) {
    return <div style={{ height, width }} className="bg-gray-50 rounded"></div>;
  }

  // Find max value for scaling
  const maxInteractions = Math.max(...data.map((d) => d.interactions));
  const maxApiCalls = Math.max(...data.map((d) => d.apiCalls));
  const maxValue = Math.max(maxInteractions, maxApiCalls);

  // Calculate points for the area paths
  const totalPoints = data.length;
  const pointWidth = 100 / (totalPoints - 1);

  // Create smooth curve paths using cubic bezier curves
  const createSmoothPath = (dataPoints: number[]) => {
    // Calculate all points
    const points = dataPoints.map((value, i) => ({
      x: i * pointWidth,
      y: 100 - (value / maxValue) * 100,
    }));

    // Start path
    let path = `M${points[0].x},${points[0].y}`;

    // Add cubic bezier curves between points
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Control points for the bezier curve (1/3 of the distance between points)
      const cp1x = current.x + (next.x - current.x) / 3;
      const cp1y = current.y;
      const cp2x = next.x - (next.x - current.x) / 3;
      const cp2y = next.y;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    // Complete the path for area fill
    path += ` L${points[points.length - 1].x},100 L${points[0].x},100 Z`;

    return path;
  };

  // Create paths for each data series
  const interactionsPath = createSmoothPath(data.map((d) => d.interactions));
  const apiCallsPath = createSmoothPath(data.map((d) => d.apiCalls));

  return (
    <div style={{ height, width }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="interactionsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="apiCallsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="95%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Interactions area */}
        <path
          d={interactionsPath}
          fill="url(#interactionsGradient)"
          stroke="#3B82F6"
          strokeWidth="0.5"
        />

        {/* API calls area */}
        <path
          d={apiCallsPath}
          fill="url(#apiCallsGradient)"
          stroke="#10B981"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

// Generate sample chart data
const generateChartData = (isLive: boolean): ChartData[] => {
  if (!isLive) return Array(7).fill({ date: "", interactions: 0, apiCalls: 0 });

  return Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    interactions: Math.floor(Math.random() * 2000) + 1000,
    apiCalls: Math.floor(Math.random() * 1500) + 500,
  }));
};

const widgets: WidgetCard[] = [
  {
    id: "1",
    title: "Demo test",
    description: "Lorem ipsum dolor sit amet",
    status: "Live",
    interactions: "12,5k",
    apiCalls: "8,5k",
    startDate: "13 Mar",
    endDate: "20 Mar",
    chartData: generateChartData(true),
  },
  {
    id: "2",
    title: "Car lease widget",
    description: "Lorem ipsum dolor sit amet",
    status: "Draft",
    interactions: "-",
    apiCalls: "-",
    startDate: "13 Mar",
    endDate: "20 Mar",
    chartData: generateChartData(true),
  },
  {
    id: "3",
    title: "Lease a Stelvio",
    description: "Lorem ipsum dolor sit amet",
    status: "Draft",
    interactions: "-",
    apiCalls: "-",
    startDate: "13 Mar",
    endDate: "20 Mar",
    chartData: generateChartData(true),
  },
];

export default function WidgetsPage() {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Widgets</h1>
            <p className="text-muted-foreground">Manage your widgets</p>
          </div>
          <Link href="/dashboard/widgets/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Widget
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4">
            <Link
              href="/dashboard/widgets"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-primary -mb-px"
            >
              Widgets
            </Link>
            <Link
              href="/dashboard/actions"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Actions
            </Link>
            <Link
              href="/dashboard/api-connections"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              API Connections
            </Link>
          </nav>
        </div>

        {/* Widget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="border rounded-lg bg-card overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{widget.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        widget.status === "Live"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {widget.status}
                    </span>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-32 w-full">
                  <SimpleAreaChart data={widget.chartData} height={128} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {widget.startDate}
                  </span>
                  <span className="text-muted-foreground">
                    {widget.endDate}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Interactions:{" "}
                    </span>
                    <span className="font-medium">{widget.interactions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">API calls: </span>
                    <span className="font-medium">{widget.apiCalls}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="w-full" size="sm">
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Embed
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-3 of 1000</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="min-w-[2.5rem]">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[2.5rem] text-muted-foreground"
            >
              100
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
