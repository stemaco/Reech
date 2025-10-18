import { useState } from 'react';
import { Button } from './ui/button';
import { simpleReminderService } from '../utils/simpleReminder';

const ReminderTest = () => {
  const [testTime, setTestTime] = useState('1');

  const testReminder = () => {
    const minutes = parseInt(testTime);
    const scheduledTime = new Date(Date.now() + minutes * 60 * 1000);
    
    console.log('Creating test reminder for:', scheduledTime);
    const reminder = simpleReminderService.createReminder(`Test reminder in ${minutes} minutes`, scheduledTime);
    console.log('Created reminder:', reminder);
    
    alert(`Reminder set for ${minutes} minutes from now! Check console for details.`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100">
      <h3 className="font-bold mb-2">Test Reminder System</h3>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={testTime}
          onChange={(e) => setTestTime(e.target.value)}
          className="w-20 px-2 py-1 border rounded"
          min="1"
          max="60"
        />
        <span>minutes</span>
        <Button onClick={testReminder} size="sm">
          Test Reminder
        </Button>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        This will create a reminder and show debug info in console
      </p>
    </div>
  );
};

export default ReminderTest;
