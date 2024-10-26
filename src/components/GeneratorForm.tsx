import React, { useState } from 'react';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { LocalDate, SSIN } from '@bn3t/ssin-lib';
import { Alert, Button, Card, DatePicker, Form, InputNumber, Select, Tooltip, Typography } from 'antd';
import type { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface GeneratorFormValues {
  birthdate: Dayjs;
  gender: 'M' | 'F';
  orderNumber: number;
}

const GeneratorForm = () => {
  const [form] = Form.useForm();
  const [generatedSSIN, setGeneratedSSIN] = useState<string | null>(null);

  const onFinish = (values: GeneratorFormValues) => {
    try {
      // Convert Dayjs to LocalDate
      const date = values.birthdate;
      const localDate = LocalDate.of(
        date.year(),
        date.month() + 1, // Dayjs months are 0-based, LocalDate expects 1-based
        date.date(),
      );

      // Use the provided order number, ensuring it follows the gender rule
      let orderNumber = values.orderNumber;
      if (values.gender === 'M' && orderNumber % 2 === 0) {
        orderNumber += 1;
      } else if (values.gender === 'F' && orderNumber % 2 === 1) {
        orderNumber += 1;
      }

      const ssin = SSIN.generateFromBirthdateAndOrderNumber(localDate, orderNumber);
      setGeneratedSSIN(ssin.getFormattedSSIN());
    } catch (error) {
      console.error('Failed to generate SSIN:', error);
    }
  };

  const copyToClipboard = () => {
    if (generatedSSIN) {
      navigator.clipboard.writeText(generatedSSIN.replace(/[.-]/g, ''));
    }
  };

  const getOrderNumberRules = (gender: 'M' | 'F' | undefined) => {
    if (!gender) return {};

    return {
      min: gender === 'M' ? 1 : 2,
      max: gender === 'M' ? 997 : 998,
      validator: (_: any, value: number) => {
        if (gender === 'M' && value % 2 === 0) {
          return Promise.reject('For males, order number must be odd');
        }
        if (gender === 'F' && value % 2 === 1) {
          return Promise.reject('For females, order number must be even');
        }
        return Promise.resolve();
      },
    };
  };

  const onValuesChange = () => {
    if (generatedSSIN) {
      setGeneratedSSIN(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2}>SSIN Generator</Title>
      <Paragraph className="mb-6">Generate a valid Belgian Social Security Identification Number (SSIN).</Paragraph>

      <Card>
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange} layout="vertical" requiredMark="optional">
          <Form.Item
            name="birthdate"
            label="Birth Date"
            rules={[{ required: true, message: 'Please select a birth date' }]}
            tooltip={{
              title: 'The date of birth for the SSIN holder',
              icon: <InfoCircleOutlined />,
            }}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select a gender' }]}
            tooltip={{
              title: 'Determines if the order number should be odd (male) or even (female)',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Select>
              <Option value="M">Male (odd order numbers)</Option>
              <Option value="F">Female (even order numbers)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="orderNumber"
            label={
              <span>
                Order Number
                <Tooltip title="For people born on the same day. Must be 001-997 (odd) for males, 002-998 (even) for females">
                  <InfoCircleOutlined className="ml-1" />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter an order number' },
              () => getOrderNumberRules(form.getFieldValue('gender')),
            ]}
            dependencies={['gender']}
          >
            <InputNumber className="w-full" min={1} max={998} precision={0} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Generate SSIN
            </Button>
          </Form.Item>
        </Form>

        <div
          className={`
            transform transition-all duration-300 ease-in-out
            ${generatedSSIN ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 invisible h-0'}
          `}
        >
          {generatedSSIN && (
            <Alert
              type="success"
              message="Generated SSIN"
              description={
                <div className="flex items-center justify-between">
                  <Text copyable>{generatedSSIN}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={copyToClipboard}
                    title="Copy raw number to clipboard"
                  />
                </div>
              }
              className="mt-4"
            />
          )}
        </div>

        <div className="mt-4 text-gray-600">
          <Title level={5}>About Order Numbers:</Title>
          <ul className="list-disc pl-5 space-y-1">
            <li>Males must use odd numbers (001, 003, ..., 997)</li>
            <li>Females must use even numbers (002, 004, ..., 998)</li>
            <li>Numbers identify people born on the same day</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default GeneratorForm;
