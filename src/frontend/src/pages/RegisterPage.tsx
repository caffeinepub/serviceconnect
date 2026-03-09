import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ServiceCategory } from "../backend";
import { useRegisterProvider } from "../hooks/useQueries";
import { allCategories, categoryMeta } from "../utils/serviceUtils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: ServiceCategory | "";
  yearsExperience: string;
  location: string;
  availability: string;
  bio: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  category: "",
  yearsExperience: "",
  location: "",
  availability: "",
  bio: "",
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  yearsExperience?: string;
  location?: string;
  availability?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Full name is required.";
  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.category) errors.category = "Please select a service category.";
  if (!data.yearsExperience) {
    errors.yearsExperience = "Years of experience is required.";
  } else if (
    Number.isNaN(Number(data.yearsExperience)) ||
    Number(data.yearsExperience) < 0 ||
    Number(data.yearsExperience) > 70
  ) {
    errors.yearsExperience = "Please enter a valid number (0–70).";
  }
  if (!data.location.trim()) errors.location = "Service location is required.";
  if (!data.availability.trim())
    errors.availability = "Availability is required.";
  return errors;
}

export function RegisterPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const {
    mutateAsync: register,
    isPending,
    error: mutationError,
  } = useRegisterProvider();

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error
      const firstErrorField = Object.keys(validationErrors)[0];
      document.getElementById(`field-${firstErrorField}`)?.focus();
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        category: formData.category as ServiceCategory,
        yearsExperience: Number(formData.yearsExperience),
        location: formData.location.trim(),
        availability: formData.availability.trim(),
        bio: formData.bio.trim(),
      });
      setSubmitted(true);
    } catch {
      // Error shown via mutationError
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          data-ocid="register.success_state"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Registration Submitted!
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Your registration has been submitted and is pending review. Our team
            will verify your information and approve your profile shortly. You
            can expect to hear back within 1–2 business days.
          </p>
          <div className="p-4 rounded-xl bg-primary/8 border border-primary/20 text-sm text-primary text-left">
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="space-y-1 text-primary/80">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Application under review by our team
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Profile approved &amp; made visible to users
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Start receiving inquiries from clients
              </li>
            </ul>
          </div>
          <Button
            className="mt-8 gap-2"
            onClick={() => {
              setSubmitted(false);
              setFormData(initialFormData);
            }}
          >
            Register Another Provider
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Register as a Provider
            </h1>
            <p className="text-white/70">
              Join our network and connect with clients who need your skills.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Error state */}
            <AnimatePresence>
              {mutationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                  data-ocid="register.error_state"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription>
                      {mutationError instanceof Error
                        ? mutationError.message
                        : "Something went wrong. Please try again."}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading overlay */}
            {isPending && (
              <div
                className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-primary/8 border border-primary/20"
                data-ocid="register.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-primary">
                  Submitting your registration...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="field-name" className="text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="field-name"
                      placeholder="e.g. Maria Santos"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={errors.name ? "border-destructive" : ""}
                      data-ocid="register.name_input"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-xs text-destructive"
                        data-ocid="register.name_error"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="field-email"
                      className="text-sm font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        Email <span className="text-destructive">*</span>
                      </span>
                    </Label>
                    <Input
                      id="field-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={errors.email ? "border-destructive" : ""}
                      data-ocid="register.email_input"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-xs text-destructive"
                        data-ocid="register.email_error"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="field-phone"
                      className="text-sm font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        Phone <span className="text-destructive">*</span>
                      </span>
                    </Label>
                    <Input
                      id="field-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      className={errors.phone ? "border-destructive" : ""}
                      data-ocid="register.phone_input"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p
                        id="phone-error"
                        className="text-xs text-destructive"
                        data-ocid="register.phone_error"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="pt-2 border-t border-border/60">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Service Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Service Category{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => updateField("category", v)}
                    >
                      <SelectTrigger
                        className={errors.category ? "border-destructive" : ""}
                        aria-invalid={!!errors.category}
                        data-ocid="register.category_select"
                      >
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((cat) => {
                          const meta = categoryMeta[cat];
                          return (
                            <SelectItem key={cat} value={cat}>
                              <span className="flex items-center gap-2">
                                <span>{meta.icon}</span>
                                <span>{meta.label}</span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.category_error"
                      >
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="field-experience"
                      className="text-sm font-medium"
                    >
                      Years of Experience{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="field-experience"
                      type="number"
                      placeholder="e.g. 5"
                      min="0"
                      max="70"
                      value={formData.yearsExperience}
                      onChange={(e) =>
                        updateField("yearsExperience", e.target.value)
                      }
                      aria-invalid={!!errors.yearsExperience}
                      aria-describedby={
                        errors.yearsExperience ? "exp-error" : undefined
                      }
                      className={
                        errors.yearsExperience ? "border-destructive" : ""
                      }
                      data-ocid="register.experience_input"
                    />
                    {errors.yearsExperience && (
                      <p
                        id="exp-error"
                        className="text-xs text-destructive"
                        data-ocid="register.experience_error"
                      >
                        {errors.yearsExperience}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="field-location"
                      className="text-sm font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Location / Area Served{" "}
                        <span className="text-destructive">*</span>
                      </span>
                    </Label>
                    <Input
                      id="field-location"
                      placeholder="e.g. Downtown Chicago, IL"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      aria-invalid={!!errors.location}
                      aria-describedby={
                        errors.location ? "loc-error" : undefined
                      }
                      className={errors.location ? "border-destructive" : ""}
                      data-ocid="register.location_input"
                    />
                    {errors.location && (
                      <p
                        id="loc-error"
                        className="text-xs text-destructive"
                        data-ocid="register.location_error"
                      >
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="field-availability"
                      className="text-sm font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Availability <span className="text-destructive">*</span>
                      </span>
                    </Label>
                    <Input
                      id="field-availability"
                      placeholder="e.g. Mon–Fri 8am–6pm"
                      value={formData.availability}
                      onChange={(e) =>
                        updateField("availability", e.target.value)
                      }
                      aria-invalid={!!errors.availability}
                      aria-describedby={
                        errors.availability ? "avail-error" : undefined
                      }
                      className={
                        errors.availability ? "border-destructive" : ""
                      }
                      data-ocid="register.availability_input"
                    />
                    {errors.availability && (
                      <p
                        id="avail-error"
                        className="text-xs text-destructive"
                        data-ocid="register.availability_error"
                      >
                        {errors.availability}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-2 border-t border-border/60">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  About You{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </h3>
                <div className="space-y-1.5">
                  <Label htmlFor="field-bio" className="text-sm font-medium">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="field-bio"
                    placeholder="Briefly describe your skills, experience, and what makes you great at what you do..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className="resize-none"
                    data-ocid="register.bio_textarea"
                  />
                  <p className="text-xs text-muted-foreground">
                    A compelling bio helps clients choose you. Aim for 50–200
                    words.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 font-semibold shadow-primary-glow"
                  disabled={isPending}
                  data-ocid="register.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Your profile will be reviewed before appearing publicly.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
