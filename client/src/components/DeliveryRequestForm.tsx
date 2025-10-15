import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaymentCommentModal from "./PaymentCommentModal";
import ConfirmationModal from "./ConfirmationModal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertDelivery } from "@shared/schema";

const branches = [
  "Al Shoala",
  "MusicMajlis",
  "Soundline Main",
  "Techniline HQ",
  "Downtown Branch",
];

const cargoTags = ["FRAGILE", "ELECTRONICS", "HEAVY"];

const timeSlots = [
  "9:30 AM - 10:30 AM",
  "10:30 AM - 11:30 AM",
  "11:30 AM - 12:30 PM",
  "12:30 PM - 1:30 PM",
  "1:30 PM - 2:30 PM",
  "2:30 PM - 3:30 PM",
  "3:30 PM - 4:30 PM",
  "4:30 PM - 5:30 PM",
  "5:30 PM - 6:30 PM",
  "6:30 PM - 7:00 PM",
];

export default function DeliveryRequestForm() {
  const { toast } = useToast();
  const [branch, setBranch] = useState("");
  const [doNumber, setDoNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hasPackages, setHasPackages] = useState("No");
  const [paymentDone, setPaymentDone] = useState("Yes");
  const [paymentComment, setPaymentComment] = useState("");
  const [cargoTag, setCargoTag] = useState("");
  const [boxQuantity, setBoxQuantity] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const createDeliveryMutation = useMutation({
    mutationFn: async (data: InsertDelivery) => {
      return await apiRequest("/api/deliveries", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      setShowConfirmation(true);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit delivery request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setBranch("");
    setDoNumber("");
    setCustomerName("");
    setPhone("");
    setAddress("");
    setHasPackages("No");
    setPaymentDone("Yes");
    setPaymentComment("");
    setCargoTag("");
    setBoxQuantity("");
    setTimeSlot("");
  };

  const handlePaymentChange = (value: string) => {
    setPaymentDone(value);
    if (value === "No") {
      setShowPaymentModal(true);
    } else {
      setPaymentComment("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deliveryData: InsertDelivery = {
      doNumber,
      branch,
      customerName,
      phone,
      address,
      hasPackages: hasPackages === "Yes",
      paymentDone: paymentDone === "Yes",
      paymentComment: paymentComment || null,
      cargoTag,
      boxQuantity: parseInt(boxQuantity),
      timeSlot,
    };

    createDeliveryMutation.mutate(deliveryData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Branch & Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select value={branch} onValueChange={setBranch} required>
                  <SelectTrigger id="branch" data-testid="select-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="do-number">Delivery Order Number *</Label>
                <Input
                  id="do-number"
                  data-testid="input-do-number"
                  placeholder="DO/*********"
                  value={doNumber}
                  onChange={(e) => setDoNumber(e.target.value)}
                  className="font-mono"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name *</Label>
                <Input
                  id="customer-name"
                  data-testid="input-customer-name"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  data-testid="input-phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                data-testid="input-address"
                placeholder="Building, floor, apartment, landmarks..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-24 resize-y"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Package Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Has Customer Packages? *</Label>
              <RadioGroup value={hasPackages} onValueChange={setHasPackages}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="packages-yes" data-testid="radio-packages-yes" />
                    <Label htmlFor="packages-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="packages-no" data-testid="radio-packages-no" />
                    <Label htmlFor="packages-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Payment Done? *</Label>
              <RadioGroup value={paymentDone} onValueChange={handlePaymentChange}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="payment-yes" data-testid="radio-payment-yes" />
                    <Label htmlFor="payment-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="payment-no" data-testid="radio-payment-no" />
                    <Label htmlFor="payment-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </div>
              </RadioGroup>
              {paymentComment && (
                <div className="text-sm text-muted-foreground mt-2">
                  Note: {paymentComment}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cargo-tag">Cargo Box Tag *</Label>
                <Select value={cargoTag} onValueChange={setCargoTag} required>
                  <SelectTrigger id="cargo-tag" data-testid="select-cargo-tag">
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="box-quantity">Box Quantity *</Label>
                <Input
                  id="box-quantity"
                  data-testid="input-box-quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={boxQuantity}
                  onChange={(e) => setBoxQuantity(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Delivery Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="time-slot">Select Time Slot (Mon-Sat) *</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot} required>
                <SelectTrigger id="time-slot" data-testid="select-time-slot">
                  <SelectValue placeholder="Choose delivery time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Sundays are blocked for deliveries</p>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full" 
          data-testid="button-submit"
          disabled={createDeliveryMutation.isPending}
        >
          {createDeliveryMutation.isPending ? "Submitting..." : "Submit Delivery Request"}
        </Button>
      </form>

      <PaymentCommentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={(comment) => setPaymentComment(comment)}
      />

      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
    </>
  );
}
