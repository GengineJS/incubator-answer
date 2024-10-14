import React, { CSSProperties } from 'react';

import PacmanLoader from 'react-spinners/RingLoader';

const override: CSSProperties = {
  position: 'absolute',
  borderColor: 'red',
  marginBottom: 80,
};

const modalStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

interface AILoadingProps {
  loading: boolean;
  color: string;
}

function AILoading({ loading, color = '#3f51b5' }: AILoadingProps) {
  return (
    <div className="sweet-loading">
      {loading && (
        <div style={modalStyle}>
          <PacmanLoader
            loading={loading}
            color={color}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
            cssOverride={override}
          />
          <p
            style={{
              position: 'absolute',
              color: '#aaaaaa',
              marginTop: '80px',
            }}>
            AI正在努力分析内容，Hold住哦
          </p>
          <p
            style={{
              position: 'absolute',
              color: '#aaaaaa',
              marginTop: '130px',
            }}>
            (如果时间过长，也可以先浏览其它内容，AI的生成记录不会丢失哦)
          </p>
        </div>
      )}
    </div>
  );
}

export default AILoading;
