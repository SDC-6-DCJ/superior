import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Questions from '../../client/src/components/Questions/Questions.jsx';
import exampleProducts from '../example_data/products/product';
import exampleQuestions from '../example_data/questions/questions';
import fetcherMock from '../../client/src/fetchers';

jest.mock('../../client/src/fetchers');
jest.useFakeTimers();

const proxyPID = 40356;
const proxyProduct = exampleProducts[proxyPID];
const proxyQList = exampleQuestions[proxyPID];

beforeEach(jest.clearAllMocks);

test('fetches questions once on load', () => {
  fetcherMock.getQuestionsById.mockResolvedValueOnce({ data: proxyQList });
  render(<Questions feature={proxyProduct} />);
  expect(fetcherMock.getQuestionsById).toHaveBeenCalledTimes(1);
});

test('does not filter questions if typing less than 3 characters', async () => {
  fetcherMock.getQuestionsById.mockResolvedValueOnce({ data: proxyQList });
  render(<Questions feature={proxyProduct} />);
  const user = userEvent.setup({ delay: null });

  const questionsBefore = await screen.findAllByRole('heading', { name: /q:/i });
  await user.type(screen.getByRole('searchbox'), 'te');
  act(() => {
    jest.advanceTimersByTime(500);
  });
  const questionsAfter = await screen.findAllByRole('heading', { name: /q:/i });

  expect(questionsBefore).toEqual(questionsAfter);
});

test('does not filter questions before input is debounced', async () => {
  fetcherMock.getQuestionsById.mockResolvedValueOnce({ data: proxyQList });
  render(<Questions feature={proxyProduct} />);
  const user = userEvent.setup({ delay: null });

  const questionsBefore = await screen.findAllByRole('heading', { name: /q:/i });
  await user.type(screen.getByRole('searchbox'), 'tem');
  act(() => {
    jest.advanceTimersByTime(499);
  });
  const questionsAfter = await screen.findAllByRole('heading', { name: /q:/i });

  expect(questionsBefore).toEqual(questionsAfter);
});

test('filters questions after typing 3 characters and waiting 500ms', async () => {
  fetcherMock.getQuestionsById.mockResolvedValueOnce({ data: proxyQList });
  render(<Questions feature={proxyProduct} />);
  const user = userEvent.setup({ delay: null });

  await user.type(screen.getByRole('searchbox'), 'tem');
  act(() => {
    jest.advanceTimersByTime(500);
  });
  const questions = await screen.findAllByRole('heading', { name: /q:/i });

  questions.map((question) => expect(question).toHaveTextContent(/tem/i));
});
