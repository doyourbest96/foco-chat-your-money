'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import {
  ArrowRight,
  Banknote,
  Bot,
  Upload,
  Download,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  Users,
  Building2,
  Wallet,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router, isAuthenticated]);

  const features = [
    {
      title: "On-Ramp",
      description:
        "Easily deposit funds into your account with multiple payment methods",
      icon: <Upload className="h-6 w-6" />,
      path: "/on-ramp",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Off-Ramp",
      description: "Withdraw your funds securely to your preferred destination",
      icon: <Download className="h-6 w-6" />,
      path: "/off-ramp",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "AI Assistant",
      description: "Get intelligent help with your transactions 24/7",
      icon: <Bot className="h-6 w-6" />,
      path: "/ai-chat",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Dashboard",
      description: "Manage your transfers and monitor your account activity",
      icon: <Banknote className="h-6 w-6" />,
      path: "/dashboard",
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const benefits = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Bank-Level Security",
      description:
        "Your funds are protected with state-of-the-art encryption and security measures.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "Global Coverage",
      description:
        "Send and receive money worldwide with competitive exchange rates.",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Lightning Fast",
      description: "Experience instant transfers and quick settlement times.",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  const stats = [
    {
      number: "1M+",
      label: "Active Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      number: "$500M+",
      label: "Monthly Volume",
      icon: <Wallet className="h-5 w-5" />,
    },
    { number: "150+", label: "Countries", icon: <Globe className="h-5 w-5" /> },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "FOCO.chat has revolutionized how our business handles international payments.",
      author: "Sarah Chen",
      role: "CEO, TechStart Inc.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      quote: "The AI assistant made managing my transfers incredibly easy.",
      author: "Michael Rodriguez",
      role: "Freelance Designer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-80" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              The Future of Money Transfer
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Send money globally without fees, powered by advanced AI
              technology for a seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="group"
                onClick={() => router.push("/sign-up")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/ai-chat")}
              >
                Try AI Assistant
                <Bot className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow border-none bg-background/50 backdrop-blur-sm"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.number}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience a comprehensive suite of tools designed to make your
              money transfers simple, secure, and efficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(feature.path)}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`p-3 rounded-lg w-fit ${feature.color} mb-4 transition-transform group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary">
                    Learn More
                    <ArrowUpRight
                      className={`ml-2 h-4 w-4 transition-transform ${
                        isHovered === index
                          ? "translate-x-1 -translate-y-1"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose FOCO.chat?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the advantages of our cutting-edge platform designed
              for modern money transfers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-all border-none bg-background/50 backdrop-blur-sm"
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl ${benefit.color}`}>
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with
              FOCO.chat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg mb-4">{testimonial.quote}</p>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of users who trust FOCO.chat for their global
            transfers. Experience the future of money movement today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="group"
              onClick={() => router.push("/sign-up")}
            >
              Create Free Account
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              onClick={() => router.push("/contact")}
            >
              Contact Sales
              <Building2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}