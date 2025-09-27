import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
  className
}: StatCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-stats-success/20 bg-stats-success/5",
    warning: "border-stats-warning/20 bg-stats-warning/5",
    info: "border-stats-info/20 bg-stats-info/5"
  };

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-stats-success",
    warning: "text-stats-warning",
    info: "text-stats-info"
  };

  return (
    <Card className={cn("shadow-card transition-smooth hover:shadow-elegant", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn("h-4 w-4", iconStyles[variant])}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}