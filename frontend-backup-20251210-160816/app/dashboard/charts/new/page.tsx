'use client';

import AdvancedChartForm from './advanced-form';

export default function NewChartPage() {
  return <AdvancedChartForm />;
}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex-1 py-3.5 rounded-xl font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Chart
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
