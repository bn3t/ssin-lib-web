// src/components/__tests__/GeneratorForm.test.tsx
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import GeneratorForm from '../GeneratorForm';

describe('GeneratorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements', () => {
    render(<GeneratorForm />);

    expect(screen.getByLabelText(/birth date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate ssin/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<GeneratorForm />);

    fireEvent.click(screen.getByRole('button', { name: /generate ssin/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/please select/i)).toHaveLength(2);
      expect(screen.getByText(/please enter an order number/i)).toBeInTheDocument();
    });
  });

  it('validates order number for male gender', async () => {
    const user = userEvent.setup();

    render(<GeneratorForm />);

    // // Select male gender
    await user.click(screen.getByLabelText(/gender/i));
    await user.click(screen.getByText(/male \(odd order numbers\)/i));

    await user.type(screen.getByLabelText(/birth date/i), '2000-01-01');

    // Enter even order number (invalid for males)
    const orderInput = screen.getByRole('spinbutton', {
      name: /order number/i,
    });
    await user.type(orderInput, '2');
    // fireEvent.change(orderInput, { target: { value: '2' } });
    expect(screen.getByText(/for males, order number must be odd/i)).toBeInTheDocument();
  });

  it('validates order number for female gender', async () => {
    const user = userEvent.setup();

    render(<GeneratorForm />);
    // Select female gender
    fireEvent.mouseDown(screen.getByLabelText(/gender/i));
    await user.click(screen.getByText(/male \(even order numbers\)/i));

    // Enter odd order number (invalid for females)
    const orderInput = screen.getByRole('spinbutton', {
      name: /order number/i,
    });
    await user.type(orderInput, '1');
    expect(screen.getByText(/for females, order number must be even/i)).toBeInTheDocument();
  });

  it('displays error message when birth date is not selected', async () => {
    const user = userEvent.setup();

    render(<GeneratorForm />);

    await user.click(screen.getByRole('button', { name: /generate ssin/i }));

    expect(screen.getByText(/please select a birth date/i)).toBeInTheDocument();
  });

  it('displays error message when gender is not selected', async () => {
    render(<GeneratorForm />);

    fireEvent.click(screen.getByRole('button', { name: /generate ssin/i }));

    await waitFor(() => {
      expect(screen.getByText(/please select a gender/i)).toBeInTheDocument();
    });
  });

  it('displays error message when order number is not entered', async () => {
    render(<GeneratorForm />);

    fireEvent.click(screen.getByRole('button', { name: /generate ssin/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter an order number/i)).toBeInTheDocument();
    });
  });

  it('displays error message when order number is out of range', async () => {
    render(<GeneratorForm />);

    fireEvent.change(screen.getByLabelText(/birth date/i), {
      target: { value: dayjs('2000-01-01') },
    });

    fireEvent.mouseDown(screen.getByLabelText(/gender/i));
    fireEvent.click(screen.getByText(/male \(odd order numbers\)/i));

    const orderInput = screen.getByRole('spinbutton', {
      name: /order number/i,
    });
    fireEvent.change(orderInput, { target: { value: '999' } });

    fireEvent.click(screen.getByRole('button', { name: /generate ssin/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter an order number/i)).toBeInTheDocument();
    });
  });

  it('displays error message when order number is invalid for gender', async () => {
    render(<GeneratorForm />);

    fireEvent.change(screen.getByLabelText(/birth date/i), {
      target: { value: dayjs('2000-01-01') },
    });

    fireEvent.mouseDown(screen.getByLabelText(/gender/i));
    fireEvent.click(screen.getByText(/female \(even order numbers\)/i));

    const orderInput = screen.getByRole('spinbutton', {
      name: /order number/i,
    });
    fireEvent.change(orderInput, { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /generate ssin/i }));

    await waitFor(() => {
      expect(screen.getByText(/for females, order number must be even/i)).toBeInTheDocument();
    });
  });

  it('generates SSIN when form is valid', async () => {
    const user = userEvent.setup();
    render(<GeneratorForm />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/birth date/i), '2000-01-01');

    fireEvent.mouseDown(screen.getByLabelText(/gender/i));
    await user.click(screen.getByText(/male \(odd order numbers\)/i));

    const orderInput = screen.getByRole('spinbutton', {
      name: /order number/i,
    });
    await user.type(orderInput, '1');

    await user.click(screen.getByRole('button', { name: /generate ssin/i }));

    expect(screen.getByText(/generated ssin/i)).toBeInTheDocument();
    expect(screen.getByText(/00\.01\.01\-001\.05/i)).toBeInTheDocument();
  });
});
