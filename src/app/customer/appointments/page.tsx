"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentForm from "@/components/customer/AppointmentForm";
import AppointmentList from "@/components/customer/AppointmentList";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { AppointmentStatus } from "@/lib/types/Appointment";

// Simple interfaces for frontend only
interface Vehicle {
  id: string;
  name: string;
  details: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  duration: string;
}

interface AppointmentData {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: string;
  serviceCategoryId: string;
  serviceName: string;
  serviceDescription: string;
  serviceDuration: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  description?: string;
  notes?: string;
}

interface AppointmentFormData {
  id?: string;
  vehicleId: string;
  serviceCategoryId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status?: AppointmentStatus;
  description?: string;
  notes?: string;
}

// Mock data - Replace with your actual data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "2020 Toyota Camry",
    details: "License: ABC-123 | Silver | Gasoline",
  },
  {
    id: "2",
    name: "2019 Honda CR-V",
    details: "License: XYZ-789 | Blue | Gasoline",
  },
  {
    id: "3",
    name: "2021 Tesla Model 3",
    details: "License: EV-456 | White | Electric",
  },
];

const mockServiceCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Oil Change",
    description: "Regular engine oil and filter replacement",
    duration: "30 minutes",
  },
  {
    id: "2",
    name: "Brake Inspection",
    description: "Complete brake system inspection and service",
    duration: "1 hour",
  },
  {
    id: "3",
    name: "General Maintenance",
    description: "Comprehensive vehicle maintenance check",
    duration: "2 hours",
  },
  {
    id: "4",
    name: "Tire Service",
    description: "Tire rotation, alignment, and replacement",
    duration: "45 minutes",
  },
  {
    id: "5",
    name: "Engine Diagnostics",
    description: "Advanced computer diagnostics and troubleshooting",
    duration: "1.5 hours",
  },
];

const mockAppointments: AppointmentData[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "2020 Toyota Camry",
    vehicleDetails: "License: ABC-123",
    serviceCategoryId: "1",
    serviceName: "Oil Change",
    serviceDescription: "Regular engine oil and filter replacement",
    serviceDuration: "30 minutes",
    appointmentDate: "2025-10-15",
    startTime: "09:00",
    endTime: "09:30",
    status: "pending",
    description: "Regular maintenance check",
    notes: "Please check tire pressure as well",
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "2019 Honda CR-V",
    vehicleDetails: "License: XYZ-789",
    serviceCategoryId: "2",
    serviceName: "Brake Inspection",
    serviceDescription: "Complete brake system inspection and service",
    serviceDuration: "1 hour",
    appointmentDate: "2025-10-20",
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    description: "Brake pedal feels soft",
  },
];

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<AppointmentData[]>(mockAppointments);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, type, title, message };
    setNotifications((prev) => [...prev, notification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCreateAppointment = async (data: AppointmentFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate no overlapping appointments
      const overlapping = appointments.find(
        (apt) =>
          apt.vehicleId === data.vehicleId &&
          apt.appointmentDate === data.appointmentDate &&
          apt.status !== "cancelled" &&
          ((data.startTime >= apt.startTime && data.startTime < apt.endTime) ||
            (data.endTime > apt.startTime && data.endTime <= apt.endTime) ||
            (data.startTime <= apt.startTime && data.endTime >= apt.endTime))
      );

      if (overlapping) {
        addNotification(
          "error",
          "Booking Failed",
          "There is already an appointment for this vehicle at the selected time."
        );
        return;
      }

      const vehicle = mockVehicles.find((v) => v.id === data.vehicleId);
      const serviceCategory = mockServiceCategories.find(
        (s) => s.id === data.serviceCategoryId
      );

      if (!vehicle || !serviceCategory) {
        addNotification(
          "error",
          "Booking Failed",
          "Invalid vehicle or service category selected."
        );
        return;
      }

      const newAppointment: AppointmentData = {
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: data.vehicleId,
        vehicleName: vehicle.name,
        vehicleDetails: vehicle.details,
        serviceCategoryId: data.serviceCategoryId,
        serviceName: serviceCategory.name,
        serviceDescription: serviceCategory.description,
        serviceDuration: serviceCategory.duration,
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "pending",
        description: data.description,
        notes: data.notes,
      };

      setAppointments((prev) => [...prev, newAppointment]);
      addNotification(
        "success",
        "Appointment Booked!",
        `Your appointment for ${serviceCategory.name} has been successfully scheduled.`
      );
      setShowForm(false);
    } catch (error) {
      addNotification(
        "error",
        "Booking Failed",
        "An error occurred while booking your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (data: AppointmentFormData) => {
    if (!editingAppointment) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for overlapping appointments (excluding the current one)
      if (data.appointmentDate && data.startTime && data.endTime) {
        const overlapping = appointments.find(
          (apt) =>
            apt.id !== editingAppointment.id &&
            apt.vehicleId === editingAppointment.vehicleId &&
            apt.appointmentDate === data.appointmentDate &&
            apt.status !== "cancelled" &&
            ((data.startTime! >= apt.startTime &&
              data.startTime! < apt.endTime) ||
              (data.endTime! > apt.startTime && data.endTime! <= apt.endTime) ||
              (data.startTime! <= apt.startTime &&
                data.endTime! >= apt.endTime))
        );

        if (overlapping) {
          addNotification(
            "error",
            "Update Failed",
            "There is already an appointment for this vehicle at the selected time."
          );
          return;
        }
      }

      const serviceCategory = mockServiceCategories.find(
        (s) => s.id === data.serviceCategoryId
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                appointmentDate: data.appointmentDate ?? apt.appointmentDate,
                startTime: data.startTime ?? apt.startTime,
                endTime: data.endTime ?? apt.endTime,
                serviceCategoryId:
                  data.serviceCategoryId ?? apt.serviceCategoryId,
                serviceName: serviceCategory?.name ?? apt.serviceName,
                serviceDescription:
                  serviceCategory?.description ?? apt.serviceDescription,
                serviceDuration:
                  serviceCategory?.duration ?? apt.serviceDuration,
                description: data.description ?? apt.description,
                notes: data.notes ?? apt.notes,
              }
            : apt
        )
      );

      addNotification(
        "success",
        "Appointment Updated!",
        "Your appointment has been successfully updated."
      );
      setEditingAppointment(null);
      setShowForm(false);
    } catch (error) {
      addNotification(
        "error",
        "Update Failed",
        "An error occurred while updating your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = (appointment: AppointmentData) => {
    const formData: AppointmentFormData = {
      id: appointment.id,
      vehicleId: appointment.vehicleId,
      serviceCategoryId: appointment.serviceCategoryId,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      description: appointment.description,
      notes: appointment.notes,
    };
    setEditingAppointment(formData);
    setShowForm(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
      addNotification(
        "success",
        "Appointment Cancelled",
        "Your appointment has been successfully cancelled."
      );
    } catch (error) {
      addNotification(
        "error",
        "Cancellation Failed",
        "An error occurred while cancelling your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    if (editingAppointment) {
      await handleUpdateAppointment(data);
    } else {
      await handleCreateAppointment(data);
    }
  };

  const handleCancelForm = () => {
    setEditingAppointment(null);
    setShowForm(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "info":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getNotificationColors = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-custom p-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`w-96 border-2 ${getNotificationColors(
                notification.type
              )} animate-in slide-in-from-right`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="text-current hover:bg-black/10"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                My Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your service appointments
              </p>
            </div>
          </div>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {/* Appointment Form */}
          {showForm && (
            <div className="max-w-3xl mx-auto">
              <AppointmentForm
                vehicles={mockVehicles}
                serviceCategories={mockServiceCategories}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                editingAppointment={editingAppointment || undefined}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Appointment List */}
          <AppointmentList
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
