"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../../../firebase";
import { collection, addDoc } from "firebase/firestore";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nicNumber: string;
  occupation?: string;
  company?: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const errorVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export default function CreateUserForm() {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>();
  
  const [userType, setUserType] = useState<"user" | "agent">("user");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const generatePassword = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);
      
      const password = generatePassword();
      
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        nicNumber: data.nicNumber,
        userType,
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(userType === "user" && {
          occupation: data.occupation,
          company: data.company
        })
      };

      const docRef = await addDoc(collection(db, "users"), userData);
      
      const emailResponse = await fetch('/Api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          userId: docRef.id,
          password
        }),
      });

      const emailResult = await emailResponse.json();
      
      if (!emailResponse.ok) {
        throw new Error(emailResult.error || emailResult.details || 'Email sending failed');
      }

      setSubmitSuccess(true);
      reset();
      setTimeout(() => router.push("/login"), 3000);
      
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create user. Please try again.'
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 py-8 px-4"
    >
      <motion.form
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <motion.div variants={itemVariants} className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Create New User</h1>
          <p className="text-blue-100 mt-1">
            Fill in the details below to register a new {userType}
          </p>
        </motion.div>

        <div className="p-8 space-y-8">
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 bg-green-100 border border-green-400 text-green-700 rounded"
              >
                User created successfully! Credentials have been sent to the provided email.
                Redirecting to login...
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitError && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 bg-red-100 border border-red-400 text-red-700 rounded"
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <div className="flex space-x-4 p-1 bg-gray-100 rounded-lg">
              {(["user", "agent"] as const).map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 text-sm font-medium rounded-md flex-1 transition-colors ${
                    userType === type
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </motion.h2>
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.firstName.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.lastName.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address"
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+94 77 123 4567"
                />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.phone.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
                  placeholder="123 Main St, Colombo"
                />
                {errors.address && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.address.message}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-lg font-semibold text-gray-900 border-b pb-2">
              Identification
            </motion.h2>
            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC/Passport Number *
                </label>
                <input
                  {...register("nicNumber", { required: "NIC/Passport is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="199012345678"
                />
                {errors.nicNumber && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.nicNumber.message}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {userType === "user" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Employment Information
              </motion.h2>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation *
                  </label>
                  <input
                    {...register("occupation", { required: "Occupation is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Software Engineer"
                  />
                  {errors.occupation && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.occupation.message}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    {...register("company", { required: "Company is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tech Solutions Ltd"
                  />
                  {errors.company && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.company.message}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="pt-4 border-t border-gray-200"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </motion.span>
                  Creating...
                </span>
              ) : (
                `Create ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.form>
    </motion.div>
  );
}