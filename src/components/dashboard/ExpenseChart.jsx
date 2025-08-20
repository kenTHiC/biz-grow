import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function ExpenseChart({ data, title = 'Expense Breakdown' }) {
  const EmptyState = () => (
    <div className="h-80 flex flex-col items-center justify-center text-gray-500">
      <BarChart3 className="w-16 h-16 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Expense Data
      </h3>
      <p className="text-center text-gray-600">
        Add expense transactions to see breakdown and analytics
      </p>
    </div>
  );

  const hasData = data && data.length > 0 && data.some(item => item.amount > 0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={12}
                    fontWeight={500}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                    formatter={value => [
                      `$${value.toLocaleString()}`,
                      'Expenses',
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#expenseGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
