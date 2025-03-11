import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/payment/check-status?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.paymentStatus === 'paid') {
          setPaymentStatus('success');
        } else {
          setPaymentStatus('failed');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      checkPaymentStatus();
    }
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {paymentStatus === 'success' ? (
        <h2>Payment Successful! Your booking is confirmed.</h2>
      ) : (
        <h2>Payment Failed. Please try again.</h2>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
