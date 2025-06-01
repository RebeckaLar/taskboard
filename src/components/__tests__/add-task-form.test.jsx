import { AddTaskForm } from '@/app/(root)/@authenticated/(admin)/add/_components/add-task-form'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { UsersProvider } from '@/context/usersContext'
import { AuthProvider } from '@/context/authContext'

// Mock functions from authContext.jsx:
jest.mock('@/lib/firebase.js', () => ({
  db: {},
  auth: {
    onAuthStateChanged: jest.fn(() => () => {}), // Mock to return an unsubscribe function
  },
  storage: {},
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key) => null, // or provide test values if needed
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(), 
  }),
}));

// Mock hooks and contexts used in AddTaskForm:
jest.mock('@/context/tasksContext.jsx', () => ({
  useTasks: () => ({
    addTask: jest.fn(() => Promise.resolve()),
    loading: false,
  }),
}));

describe('AddTaskForm', () => {
  it('does not disable submit button until loading or submitted', () => {

    // ARRANGE our components:
    render(
      <AuthProvider>
        <UsersProvider>
          <AddTaskForm />
        </UsersProvider>
      </AuthProvider>
    );

    // ACT like an event 
    const submitBtn = screen.getByRole('button', { name: /Create task/i });

    // ASSERT
    expect(submitBtn).not.toBeDisabled(); //Submit button should not be disabled until after button is clicked on
  });
});
