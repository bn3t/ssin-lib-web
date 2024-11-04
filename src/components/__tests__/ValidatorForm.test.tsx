// src/components/__tests__/ValidatorForm.test.tsx
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ValidatorForm from '../ValidatorForm';

describe('ValidatorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form elements', () => {
    render(<ValidatorForm />);

    expect(screen.getByLabelText(/ssin number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate ssin/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ValidatorForm />);

    fireEvent.click(screen.getByRole('button', { name: /validate ssin/i }));

    await waitFor(() => {
      expect(screen.getByText(/please input an ssin number/i)).toBeInTheDocument();
    });
  });

  it('validates SSIN format', async () => {
    const user = userEvent.setup();

    render(<ValidatorForm />);

    await user.type(screen.getByLabelText(/ssin number/i), '05020940754');

    await user.click(screen.getByRole('button', { name: /validate ssin/i }));

    expect(screen.getByText(/Invalid SSIN/i)).toBeInTheDocument();
  });

  it('validates and displays SSIN details when valid', async () => {
    const user = userEvent.setup();

    render(<ValidatorForm />);

    await user.type(screen.getByLabelText(/ssin number/i), '05020940753');

    await user.click(screen.getByRole('button', { name: /validate ssin/i }));

    expect(screen.getByText(/valid ssin/i)).toBeInTheDocument();
    expect(screen.getByText(/05\.02\.09\-407\.53/i)).toBeInTheDocument();
    expect(screen.getByText(/05020940753/i)).toBeInTheDocument();
    expect(screen.getByText(/2005\-02\-09/i)).toBeInTheDocument();
  });
});
