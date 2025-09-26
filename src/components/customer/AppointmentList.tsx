"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Car,
  MessageSquare,
  Edit,
  Trash2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppointmentData,
  AppointmentStatus,
  ConsultationType,
} from "@/lib/types/Appointment";

interface AppointmentListProps {
  appointments: AppointmentData[];
  onEdit: (appointment: AppointmentData) => void;
  onDelete: (appointmentId: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  "in-progress": "bg-orange-100 text-orange-800 border-orange-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const consultationTypeLabels: Record<ConsultationType, string> = {
  "general-checkup": "General Checkup",
  "specific-issue": "Specific Issue",
  "maintenance-advice": "Maintenance Advice",
  "performance-issue": "Performance Issue",
  "safety-concern": "Safety Concern",
  other: "Other",
};

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  isLoading = false,
}: AppointmentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (appointmentId: string) => {
    try {
      setDeletingId(appointmentId);
      await onDelete(appointmentId);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEditOrDelete = (status: AppointmentStatus) => {
    return status === "pending" || status === "confirmed";
  };

  if (appointments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-secondary text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Consultation Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            No consultation appointments scheduled yet
          </p>
          <p className="text-sm text-gray-500">
            Book your first consultation using the form above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {
                appointments.filter(
                  (apt) =>
                    apt.status === "pending" || apt.status === "confirmed"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter((apt) => apt.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                appointments.filter((apt) => apt.status === "in-progress")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="w-full">
        <CardHeader className="bg-secondary text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Consultation Appointments ({appointments.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    Vehicle
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Consultation
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Car className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">
                            {appointment.vehicleName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.vehicleDetails}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">
                            {
                              consultationTypeLabels[
                                appointment.consultationType
                              ]
                            }
                          </p>
                          {appointment.customerIssue && (
                            <p className="text-sm text-gray-600">
                              Issue: {appointment.customerIssue}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">
                            {formatDate(appointment.appointmentDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={cn(
                          "border",
                          statusColors[appointment.status]
                        )}
                        variant="outline"
                      >
                        {statusLabels[appointment.status]}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        {canEditOrDelete(appointment.status) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(appointment)}
                              className="hover:bg-blue-50"
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50"
                                  disabled={
                                    isLoading || deletingId === appointment.id
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    Cancel Consultation?
                                  </DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel this
                                    consultation appointment? This action cannot
                                    be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="bg-gray-50 p-3 rounded-lg mt-4">
                                  <p className="text-sm text-gray-600">
                                    <strong>Vehicle:</strong>{" "}
                                    {appointment.vehicleName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Date:</strong>{" "}
                                    {formatDate(appointment.appointmentDate)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Time:</strong>{" "}
                                    {formatTime(appointment.startTime)} -{" "}
                                    {formatTime(appointment.endTime)}
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(appointment.id)}
                                    disabled={deletingId === appointment.id}
                                  >
                                    {deletingId === appointment.id
                                      ? "Cancelling..."
                                      : "Yes, Cancel Appointment"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        {!canEditOrDelete(appointment.status) && (
                          <span className="text-sm text-gray-500 italic">
                            Cannot modify
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4 p-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="border-l-4"
                style={{
                  borderLeftColor:
                    appointment.status === "pending"
                      ? "#f59e0b"
                      : appointment.status === "confirmed"
                      ? "#3b82f6"
                      : appointment.status === "completed"
                      ? "#10b981"
                      : appointment.status === "cancelled"
                      ? "#ef4444"
                      : "#f97316",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      className={cn("border", statusColors[appointment.status])}
                      variant="outline"
                    >
                      {statusLabels[appointment.status]}
                    </Badge>

                    <div className="flex gap-2">
                      {canEditOrDelete(appointment.status) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(appointment)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  isLoading || deletingId === appointment.id
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Consultation?</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel this
                                  consultation appointment?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(appointment.id)}
                                  disabled={deletingId === appointment.id}
                                >
                                  {deletingId === appointment.id
                                    ? "Cancelling..."
                                    : "Cancel Appointment"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {appointment.vehicleName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>
                        {consultationTypeLabels[appointment.consultationType]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {formatTime(appointment.startTime)} -{" "}
                        {formatTime(appointment.endTime)}
                      </span>
                    </div>

                    {appointment.customerIssue && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Issue:</span>{" "}
                          {appointment.customerIssue}
                        </p>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
