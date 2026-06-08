import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, Button } from '../components/ui/index.jsx';
import { onboardingService } from '../services/api.js';

export default function OnboardingQuiz() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const answers = Object.values(data).map((v) => Number(v));
      const res = await onboardingService.submitQuiz(answers);
      alert(`Risk profile saved: ${res.risk}`);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <h2 className="text-xl font-bold mb-4">Risk Profiling Quiz</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[1,2,3,4,5,6,7].map((q) => (
            <div key={q}>
              <label className="block mb-1">Question {q}</label>
              <select {...register(`q${q}`)} className="w-full p-2 border rounded">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="submit">Submit Quiz</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
