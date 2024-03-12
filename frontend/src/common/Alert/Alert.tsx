import React, { useEffect, useState } from 'react';

interface AlertProps {
    message: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const Alert: React.FC<AlertProps> = ({ message, variant }) => {
    const [show, setShow] = useState<boolean>(true);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setShow(false);
        }, 3000);
    
        return () => clearTimeout(timeoutId);
    }, []); 

    return (
        <>
            {
                show &&

                <div style={{ width: "max-content", position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }} className={`alert alert-${variant} alert-dismissible fade show`} role="alert">
                    {message}
                    <button onClick={() => setShow(false)} type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
        </>

    );
};

export default Alert;
