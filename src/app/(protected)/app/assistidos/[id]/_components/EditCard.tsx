'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';

interface EditCardProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
}

export function EditCard({ title, isEditing, onEdit, onCancel, onSave, children }: EditCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
