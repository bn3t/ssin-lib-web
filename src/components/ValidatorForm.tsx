import React, { useState } from 'react';
import { Card, Input, Button, Alert, Typography, Form } from 'antd';
import { SSIN } from '@bn3t/ssin-lib';

const { Title, Text, Paragraph } = Typography;

const ValidatorForm = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<{ valid: boolean; details?: any; error?: string } | null>(null);

  const formatSSIN = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length && i < 11; i++) {
      if (i === 2 || i === 4) formatted += '.';
      else if (i === 6) formatted += '-';
      else if (i === 9) formatted += '.';
      formatted += digits[i];
    }
    return formatted;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSIN(e.target.value);
    form.setFieldValue('ssin', formatted);
    if (result) setResult(null);
  };

  const onFinish = (values: { ssin: string }) => {
    try {
      const rawSSIN = values.ssin.replace(/[.-]/g, '');
      const ssin = new SSIN(rawSSIN);
      setResult({
        valid: true,
        details: {
          formatted: ssin.getFormattedSSIN(),
          birthdate: ssin.getBirthdate()?.toString(),
          gender: ssin.getGender(),
          raw: rawSSIN,
        },
      });
    } catch (error) {
      setResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid SSIN',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2}>SSIN Validator</Title>
      <Paragraph className="mb-6">
        Validate a Belgian Social Security Identification Number (SSIN). Enter the number with or without formatting
        (YY.MM.DD-OOO.CC).
      </Paragraph>

      <Card>
        <Form form={form} onFinish={onFinish} layout="vertical" onValuesChange={() => result && setResult(null)}>
          <Form.Item
            name="ssin"
            label="SSIN Number"
            rules={[
              { required: true, message: 'Please input an SSIN number' },
              {
                pattern: /^(\d{2}[.-]\d{2}[.-]\d{2}[-]\d{3}[.-]\d{2}|\d{11})$/,
                message: 'Invalid SSIN format',
              },
            ]}
            tooltip="Format: YY.MM.DD-OOO.CC or raw 11 digits"
          >
            <Input
              placeholder="Example: 05.02.09-407.53"
              className="text-lg font-mono"
              onChange={onInputChange}
              maxLength={15}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Validate SSIN
            </Button>
          </Form.Item>
        </Form>

        <div
          className={`
            transform transition-all duration-300 ease-in-out
            ${result ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 invisible h-0'}
          `}
        >
          {result && (
            <Alert
              type={result.valid ? 'success' : 'error'}
              message={result.valid ? 'Valid SSIN' : 'Invalid SSIN'}
              description={
                result.valid ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Text>Formatted:</Text>
                      <Text copyable className="font-mono">
                        {result.details.formatted}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text>Raw Number:</Text>
                      <Text copyable className="font-mono">
                        {result.details.raw}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text>Birth Date:</Text>
                      <Text>{result.details.birthdate}</Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text>Gender:</Text>
                      <Text>{result.details.gender}</Text>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">{result.error}</div>
                )
              }
              className="mt-4"
            />
          )}
        </div>

        <div className="mt-4 text-gray-600">
          <Title level={5}>SSIN Format:</Title>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Text code>YY</Text>: Year of birth (00-99)
            </li>
            <li>
              <Text code>MM</Text>: Month of birth (01-12)
            </li>
            <li>
              <Text code>DD</Text>: Day of birth (01-31)
            </li>
            <li>
              <Text code>OOO</Text>: Order number (odd for males, even for females)
            </li>
            <li>
              <Text code>CC</Text>: Check digits
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ValidatorForm;
