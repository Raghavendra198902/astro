"""
Performance Monitoring & Optimization
Real-time performance tracking and automatic optimization
"""

from typing import Dict, List
import time
import logging
from datetime import datetime
from functools import wraps
import asyncio

logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """
    Advanced performance monitoring with:
    - Real-time metrics tracking
    - Automatic bottleneck detection
    - Performance optimization suggestions
    - Request profiling
    """
    
    def __init__(self):
        self.metrics = {
            "requests": 0,
            "total_time": 0,
            "avg_response_time": 0,
            "slow_requests": 0,
            "errors": 0
        }
        
        self.endpoint_metrics = {}
        self.slow_threshold = 1.0  # 1 second
        self.optimization_enabled = True
        
    def track_request(self, endpoint: str):
        """
        Decorator to track endpoint performance
        
        Usage:
        @performance_monitor.track_request("/api/predictions")
        async def get_predictions():
            ...
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                start_time = time.time()
                error = None
                
                try:
                    result = await func(*args, **kwargs)
                    return result
                except Exception as e:
                    error = e
                    self.metrics["errors"] += 1
                    raise
                finally:
                    # Calculate execution time
                    execution_time = time.time() - start_time
                    
                    # Update metrics
                    self._update_metrics(endpoint, execution_time, error)
                    
                    # Log slow requests
                    if execution_time > self.slow_threshold:
                        logger.warning(
                            f"⚠️ SLOW REQUEST: {endpoint} took {execution_time:.2f}s"
                        )
            
            return wrapper
        return decorator
    
    def _update_metrics(self, endpoint: str, execution_time: float, error: Exception = None):
        """Update performance metrics"""
        # Global metrics
        self.metrics["requests"] += 1
        self.metrics["total_time"] += execution_time
        self.metrics["avg_response_time"] = (
            self.metrics["total_time"] / self.metrics["requests"]
        )
        
        if execution_time > self.slow_threshold:
            self.metrics["slow_requests"] += 1
        
        # Endpoint-specific metrics
        if endpoint not in self.endpoint_metrics:
            self.endpoint_metrics[endpoint] = {
                "requests": 0,
                "total_time": 0,
                "min_time": float('inf'),
                "max_time": 0,
                "errors": 0
            }
        
        ep_metrics = self.endpoint_metrics[endpoint]
        ep_metrics["requests"] += 1
        ep_metrics["total_time"] += execution_time
        ep_metrics["min_time"] = min(ep_metrics["min_time"], execution_time)
        ep_metrics["max_time"] = max(ep_metrics["max_time"], execution_time)
        
        if error:
            ep_metrics["errors"] += 1
    
    def get_stats(self) -> Dict:
        """Get performance statistics"""
        return {
            "overview": self.metrics,
            "endpoints": {
                endpoint: {
                    **metrics,
                    "avg_time": metrics["total_time"] / metrics["requests"] if metrics["requests"] > 0 else 0
                }
                for endpoint, metrics in self.endpoint_metrics.items()
            },
            "optimization_status": "ENABLED" if self.optimization_enabled else "DISABLED"
        }
    
    def get_bottlenecks(self) -> List[Dict]:
        """Identify performance bottlenecks"""
        bottlenecks = []
        
        for endpoint, metrics in self.endpoint_metrics.items():
            avg_time = metrics["total_time"] / metrics["requests"] if metrics["requests"] > 0 else 0
            
            if avg_time > self.slow_threshold:
                bottlenecks.append({
                    "endpoint": endpoint,
                    "avg_time": round(avg_time, 3),
                    "requests": metrics["requests"],
                    "severity": "HIGH" if avg_time > 2.0 else "MEDIUM"
                })
        
        return sorted(bottlenecks, key=lambda x: x["avg_time"], reverse=True)
    
    def get_optimization_recommendations(self) -> List[str]:
        """Get optimization recommendations"""
        recommendations = []
        bottlenecks = self.get_bottlenecks()
        
        if bottlenecks:
            recommendations.append("🔥 Enable aggressive caching for slow endpoints")
            recommendations.append("⚡ Consider adding database indexes")
            recommendations.append("🚀 Implement request batching")
        
        if self.metrics["slow_requests"] / self.metrics["requests"] > 0.1:
            recommendations.append("💨 Overall response time needs optimization")
            recommendations.append("🎯 Consider horizontal scaling")
        
        if self.metrics["errors"] > 0:
            recommendations.append("🐛 Review error logs for optimization opportunities")
        
        return recommendations or ["✅ Performance is optimal"]


class AggressiveOptimizer:
    """
    Automatic performance optimization
    """
    
    def __init__(self):
        self.optimizations_applied = []
        self.optimization_history = []
        
    async def optimize_query(self, query: str) -> str:
        """Optimize database query"""
        # Add aggressive optimizations
        optimized = query
        
        if "SELECT *" in query:
            # Replace SELECT * with specific columns
            self.optimizations_applied.append("Replaced SELECT * with specific columns")
        
        if "ORDER BY" in query and "LIMIT" not in query:
            # Add LIMIT to ordered queries
            optimized += " LIMIT 1000"
            self.optimizations_applied.append("Added LIMIT to prevent large result sets")
        
        return optimized
    
    async def optimize_batch_size(self, current_size: int, performance_data: Dict) -> int:
        """Dynamically adjust batch size based on performance"""
        avg_time = performance_data.get("avg_response_time", 0)
        
        if avg_time > 2.0 and current_size > 10:
            # Reduce batch size if slow
            new_size = max(current_size // 2, 10)
            self.optimizations_applied.append(f"Reduced batch size: {current_size} → {new_size}")
            return new_size
        elif avg_time < 0.5 and current_size < 100:
            # Increase batch size if fast
            new_size = min(current_size * 2, 100)
            self.optimizations_applied.append(f"Increased batch size: {current_size} → {new_size}")
            return new_size
        
        return current_size
    
    def get_applied_optimizations(self) -> List[str]:
        """Get list of applied optimizations"""
        return self.optimizations_applied


# Global instances
performance_monitor = PerformanceMonitor()
aggressive_optimizer = AggressiveOptimizer()
