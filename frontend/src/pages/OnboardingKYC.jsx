import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Card } from '../components/ui/index.jsx';
import { onboardingService } from '../services/api.js';
import { useAuthStore } from '../stores/authStore.js';

export default function OnboardingKYC() {
  const { register, handleSubmit, formState } = useForm();
  const auth = useAuthStore();

  const onSubmit = async (data) => {
    try {
      const res = await onboardingService.submitKyc(data);
      alert('KYC submitted (mock)');
    } catch (err) {
      alert('Failed to submit KYC');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <h2 className="text-xl font-bold mb-4">KYC (Mock)</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="PAN" {...register('pan', { required: true, minLength: 10, maxLength: 10 })} />
          <Input label="Aadhaar (optional)" {...register('aadhar')} />
          <Input label="Address" {...register('address', { required: true })} />
          <div className="flex justify-end">
            <Button type="submit">Submit KYC</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
