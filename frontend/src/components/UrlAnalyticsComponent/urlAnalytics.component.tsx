// UrlAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Ensure you have the correct import
import AnalyticsService from '../../services/analytics-service'; // Update with the correct path
import PieChart from '../../common/Piechart/PieChart';

interface UrlData {
  ID: number;
  OriginalURL: string;
  ShortURL: string;
}

interface AnalyticsData {
  totalClicks: number;
  mostFrequentReferer: string;
  mobilePhoneClicks: number;
  desktopClicks: number;
}

const UrlAnalytics = () => {
  const location = useLocation();
  const urlData = location.state.urlData as UrlData;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {

        const response = await AnalyticsService.fetchUrlAnalytics(urlData.ID.toString());
        console.log(response.data.analytics);

        setAnalyticsData(response.data.analytics);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className='card'>
      <h4>Analytics for {urlData.OriginalURL.substring(0, 60)}</h4>
      <hr/>
      {analyticsData ? (
        <div>
          <p>Total Clicks: <span className='text-dark'><strong>{analyticsData.totalClicks}</strong></span></p>
          <hr/>
                    
          <p>Most Frequent Referer: {analyticsData.mostFrequentReferer.length > 0 ? analyticsData.mostFrequentReferer : <strong><span className='text-warning'>Not enough data to obtain this metric!!</span></strong>}</p>
          <hr/>
          {analyticsData.totalClicks > 0 && analyticsData.mobilePhoneClicks >= 0 && analyticsData.desktopClicks >= 0 && (
            <div style={{ width: "40%", height: "30%" }}>
              <h4>Mobile vs Desktop Clicks</h4>
              <PieChart
                totalMobileClicks={analyticsData.mobilePhoneClicks}
                totalDesktopClicks={analyticsData.desktopClicks}
              />
            </div>

          )}
        </div>
      ) : (
        <p>Loading analytics data...</p>
      )}
    </div>
  );
};

export default UrlAnalytics;
