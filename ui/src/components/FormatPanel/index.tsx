import React from 'react';
import { Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// import { MathJaxContext, MathJax } from 'better-react-mathjax';

// import { config } from '@/components/MathJaxArticle';

const FormatPanel = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'tag_modal' });

  return (
    <Col className="page-right-side mt-4 mt-xl-0">
      <Card>
        <Tabs defaultActiveKey="how_to_format" id="format-tab">
          <Tab
            eventKey="how_to_format"
            title={t('title', { keyPrefix: 'how_to_format' })}>
            <Card.Body
              className="fmt small"
              dangerouslySetInnerHTML={{
                __html: t('desc', { keyPrefix: 'how_to_format' }),
              }}
            />
          </Tab>
          <Tab
            eventKey="formula_to_format"
            title={t('title', { keyPrefix: 'formula_to_format' })}>
            {/* <MathJaxContext version={3} config={config}> */}
            {/*  <MathJax> */}
            <Card.Body
              className="fmt small"
              dangerouslySetInnerHTML={{
                __html: t('desc', { keyPrefix: 'formula_to_format' }),
              }}
            />
            {/*  </MathJax> */}
            {/* </MathJaxContext> */}
          </Tab>
        </Tabs>
      </Card>
    </Col>
  );
};

export default FormatPanel;
