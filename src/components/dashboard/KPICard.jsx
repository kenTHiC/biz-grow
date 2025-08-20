import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function KPICard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  color = 'bg-blue-500',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    changeType === 'positive'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {change}
                </span>
                <span className="text-xs text-slate-500 ml-1">
                  vs last period
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
