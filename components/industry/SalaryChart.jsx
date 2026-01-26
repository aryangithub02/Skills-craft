"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Render a card containing a bar chart of salary ranges by role with an Annual/Monthly view toggle.
 *
 * @param {Object[]} salaryRanges - Array of salary range objects (ordered by relevance).
 * @param {string} salaryRanges[].role - Role name.
 * @param {number} salaryRanges[].min - Minimum salary (annual, in rupees).
 * @param {number} salaryRanges[].median - Median salary (annual, in rupees).
 * @param {number} salaryRanges[].max - Maximum salary (annual, in rupees).
 * @returns {JSX.Element} The rendered Card with the chart or a message when no data is available.
 */
export default function SalaryChart({ salaryRanges }) {
    const [view, setView] = React.useState('annual'); // 'annual' or 'monthly'

    if (!salaryRanges || salaryRanges.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Salary Insights</CardTitle>
                    <CardDescription>No salary data available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Format data for chart - take top 6 roles for readability
    const chartData = salaryRanges.slice(0, 6).map(range => ({
        role: range.role.length > 20 ? range.role.substring(0, 20) + '...' : range.role,
        fullRole: range.role,
        min: view === 'monthly' ? Math.round(range.min / 12) : range.min,
        median: view === 'monthly' ? Math.round(range.median / 12) : range.median,
        max: view === 'monthly' ? Math.round(range.max / 12) : range.max,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.fullRole}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                            Min: <span className="font-medium">₹{payload[0].payload.min.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </p>
                        <p className="text-primary">
                            Median: <span className="font-semibold">₹{payload[0].payload.median.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </p>
                        <p className="text-green-600">
                            Max: <span className="font-medium">₹{payload[0].payload.max.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Salary Insights</CardTitle>
                    <CardDescription>
                        Salary ranges across common roles
                    </CardDescription>
                </div>
                <div className="flex bg-muted p-1 rounded-md">
                    <button
                        onClick={() => setView('annual')}
                        className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                            view === 'annual' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Annual
                    </button>
                    <button
                        onClick={() => setView('monthly')}
                        className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                            view === 'monthly' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Monthly
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                            dataKey="role" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                                if (view === 'monthly') {
                                    return `₹${(value / 1000).toFixed(0)}K`;
                                }
                                return `₹${(value / 100000).toFixed(0)}L`;
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            wrapperStyle={{ paddingTop: "20px" }}
                        />
                        <Bar dataKey="min" fill="#cbd5e1" name="Minimum" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="median" fill="#3b82f6" name="Median" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="max" fill="#10b981" name="Maximum" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>

                {salaryRanges.length > 6 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                        Showing top 6 roles. Full data available in detailed view.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}