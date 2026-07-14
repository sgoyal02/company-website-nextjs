import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '@/pages/contact';
import { useMutation } from '@tanstack/react-query';

//mock-
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}));
const mockMut = jest.fn();
const setupMutation = (overrides = {}) => {
  (useMutation as jest.Mock).mockReturnValue({
    mutate: mockMut,
    isPending: false,
    ...overrides,
  });
};

describe('contact page- tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMutation();
    global.alert = jest.fn();
  });

  it('render ui-test', () => {
    render(<ContactPage />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('empty form errors- tests', async () => {
    render(<ContactPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    expect(await screen.findByText('Name must be at least 1 char')).toBeInTheDocument();
    expect(await screen.getByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Message must be at least 10 char')).toBeInTheDocument();
  });

  it('invalid form email error- test', async () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { name: 'name', value: 'Rhea' },
    });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { name: 'email', value: 'abc12' },
    });
    fireEvent.change(screen.getByPlaceholderText('help text'), {
      target: { name: 'message', value: 'hi, this is a valid message here.' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    expect(await screen.findByText('Please enter valid email')).toBeInTheDocument();
  });

  it('invalid form msg error- test', async () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { name: 'name', value: 'Sakshi' },
    });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { name: 'email', value: 'abc12@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('help text'), {
      target: { name: 'message', value: 'short msg' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    expect(await screen.findByText('Message must be at least 10 char')).toBeInTheDocument();
  });

  it('submit form success- test', async () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { name: 'name', value: 'Sakshi' },
    });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { name: 'email', value: 'abc12@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('help text'), {
      target: { name: 'message', value: 'Hi, here is valid message written.' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
    await waitFor(() => {
      expect(mockMut).toHaveBeenCalledWith({
        name: 'Sakshi',
        email: 'abc12@gmail.com',
        message: 'Hi, here is valid message written.',
      });
    });
  });

  it('state change when submit- test', () => {
    setupMutation({ isPending: true });
    render(<ContactPage />);
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  });
});
