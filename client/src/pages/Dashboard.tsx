import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Magnetic } from "@/components/ui/magnetic";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { 
  Sparkles, 
  Share2, 
  Bell, 
  Plus,
  Link as LinkIcon,
  Sparkle,
  Pencil,
  Menu,
  MessageSquare,
  FileText,
  Smartphone,
  Monitor,
  Search,
  Layers,
  Trash2,
  GripVertical,
  Paintbrush,
  X,
  Upload,
  Lock,
  Crown,
  Eye,
  EyeOff,
  RotateCcw,
  Mail,
  Linkedin,
  ArrowUpRight,
  Copy,
  Instagram,
  Dribbble,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import { SiBehance } from "react-icons/si";
import { Link } from "wouter";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StardustButton } from '@/components/StardustButton';
import { TiptapEditor } from '@/components/TiptapEditor';
import Dock from "@/components/ui/dock";

import { CourseCard } from "@/components/CourseCard";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CrypticText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ''));
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const targetChars = text.split('');
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        targetChars.map((char, index) => {
          if (index < iteration) {
            return targetChars[index];
          }
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
      );

      iteration += 1 / 3;

      if (iteration >= targetChars.length) {
        clearInterval(interval);
        setDisplayText(targetChars);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={containerRef} className={className}>
      {displayText.join('')}
    </span>
  );
};

import { usePegboardSounds } from "@/hooks/use-pegboard-sounds";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { playPick, playPlace } = usePegboardSounds();
  const isMobile = useIsMobile();
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(() => {
    const saved = localStorage.getItem('dashboard-wallpaper');
    return saved || null;
  });
  const [previousWallpaper, setPreviousWallpaper] = useState<string | null>(null);
  const [isDarkWallpapers, setIsDarkWallpapers] = useState(() => {
    const saved = localStorage.getItem('dashboard-wallpaper-mode');
    return saved === 'dark';
  });
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(() => {
    const saved = localStorage.getItem('dashboard-custom-wallpaper');
    return saved || null;
  });
  const [backgroundBlur, setBackgroundBlur] = useState<number>(() => {
    const saved = localStorage.getItem('dashboard-background-blur');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [backgroundEffectType, setBackgroundEffectType] = useState<'blur' | 'grain'>(() => {
    const saved = localStorage.getItem('dashboard-background-effect-type');
    return (saved === 'blur' || saved === 'grain') ? saved : 'blur';
  });
  const [grainIntensity, setGrainIntensity] = useState<number>(() => {
    const saved = localStorage.getItem('dashboard-grain-intensity');
    return saved ? parseInt(saved, 10) : 30;
  });
  const [backgroundMotion, setBackgroundMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('dashboard-background-motion');
    return saved === 'on';
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard-section-order');
    // Ensure work_experience is in the list and placed before testimonials
    let order = saved ? JSON.parse(saved) : ['works', 'work_experience', 'about', 'testimonials', 'toolbox'];
    if (!order.includes('work_experience')) {
      const testimonialIndex = order.indexOf('testimonials');
      if (testimonialIndex !== -1) {
        order.splice(testimonialIndex, 0, 'work_experience');
      } else {
        order.push('work_experience');
      }
    }
    // Ensure about is in the list and placed after toolbox or at the end
    if (!order.includes('about')) {
      const toolboxIndex = order.indexOf('toolbox');
      if (toolboxIndex !== -1) {
        order.splice(toolboxIndex + 1, 0, 'about');
      } else {
        order.push('about');
      }
    }

    // Explicitly reorder to move testimonials below about if they are both present
    const aboutIdx = order.indexOf('about');
    const testimonialsIdx = order.indexOf('testimonials');
    if (aboutIdx !== -1 && testimonialsIdx !== -1 && testimonialsIdx < aboutIdx) {
      order.splice(testimonialsIdx, 1);
      const newAboutIdx = order.indexOf('about');
      order.splice(newAboutIdx + 1, 0, 'testimonials');
    }
    
    return order;
  });
  const [workExperiences, setWorkExperiences] = useState([
    {
      id: 1,
      role: "Senior Product Designer",
      company: "Stark Industries",
      period: "2022 - Present",
      description: "Leading the design system for iron-man suits and industrial interfaces.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SI"
    },
    {
      id: 2,
      role: "Product Designer",
      company: "Wayne Enterprises",
      period: "2020 - 2022",
      description: "Designed multi-functional gadgets and vehicle UI for tactical deployment.",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=WE"
    }
  ]);
  const [selectedFont, setSelectedFont] = useState<string>(() => {
    const saved = localStorage.getItem('dashboard-font');
    return saved || 'inter';
  });
  const [scrollOffset, setScrollOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const pinBoardRef = useRef<HTMLDivElement>(null);
  const [user] = useState({
    name: "Shai!",
    role: "A 0→1 Product Designer with 6 years of experience. I design and develop digital products, create prototypes, and design interfaces.",
    avatar: "",
    categories: [
      "Design Systems and Style Guides",
      "Human-Centered Design",
      "Ethnographic Research",
      "Design Thinking"
    ]
  });

  useEffect(() => {
    const checkIfMobileOrTablet = () => {
      setIsMobileOrTablet(window.innerWidth < 1190);
    };
    
    checkIfMobileOrTablet();
    window.addEventListener('resize', checkIfMobileOrTablet);
    
    return () => window.removeEventListener('resize', checkIfMobileOrTablet);
  }, []);

  useEffect(() => {
    if (selectedWallpaper) {
      localStorage.setItem('dashboard-wallpaper', selectedWallpaper);
    } else {
      localStorage.removeItem('dashboard-wallpaper');
    }
    
    // Update previous wallpaper after a delay to allow crossfade
    const timer = setTimeout(() => {
      setPreviousWallpaper(selectedWallpaper);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedWallpaper]);

  useEffect(() => {
    localStorage.setItem('dashboard-wallpaper-mode', isDarkWallpapers ? 'dark' : 'light');
  }, [isDarkWallpapers]);

  useEffect(() => {
    if (customWallpaper) {
      localStorage.setItem('dashboard-custom-wallpaper', customWallpaper);
    } else {
      localStorage.removeItem('dashboard-custom-wallpaper');
    }
  }, [customWallpaper]);

  useEffect(() => {
    localStorage.setItem('dashboard-background-blur', backgroundBlur.toString());
  }, [backgroundBlur]);

  useEffect(() => {
    localStorage.setItem('dashboard-background-effect-type', backgroundEffectType);
  }, [backgroundEffectType]);

  useEffect(() => {
    localStorage.setItem('dashboard-grain-intensity', grainIntensity.toString());
  }, [grainIntensity]);

  useEffect(() => {
    localStorage.setItem('dashboard-background-motion', backgroundMotion ? 'on' : 'off');
  }, [backgroundMotion]);

  useEffect(() => {
    localStorage.setItem('dashboard-section-order', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const fontOptions: Record<string, { name: string; family: string; description: string }> = {
    'inter': { name: 'Inter', family: 'Inter, sans-serif', description: 'Clean and modern sans-serif' },
    'satoshi': { name: 'Satoshi', family: 'Satoshi, sans-serif', description: 'Geometric contemporary sans' },
    'manrope': { name: 'Manrope', family: 'Manrope, sans-serif', description: 'Modern geometric sans-serif' },
    'dm-sans': { name: 'DM Sans', family: '"DM Sans", sans-serif', description: 'Low-contrast geometric sans' },
    'source-serif-4': { name: 'Source Serif 4', family: '"Source Serif 4", serif', description: 'Elegant transitional serif' },
    'merriweather': { name: 'Merriweather', family: 'Merriweather, serif', description: 'Classic readable serif' },
    'ibm-plex-sans': { name: 'IBM Plex Sans', family: '"IBM Plex Sans", sans-serif', description: 'Neutral corporate sans' },
    'work-sans': { name: 'Work Sans', family: '"Work Sans", sans-serif', description: 'Optimized for screen display' },
    'roboto-mono': { name: 'Roboto Mono', family: '"Roboto Mono", monospace', description: 'Technical monospace style' },
  };

  useEffect(() => {
    localStorage.setItem('dashboard-font', selectedFont);
    const font = fontOptions[selectedFont] || fontOptions['inter'];
    document.documentElement.style.setProperty('--font-sans', font.family);
    document.documentElement.style.setProperty('--font-heading', font.family);
    document.documentElement.style.setProperty('--font-serif', font.family);
    document.body.style.fontFamily = font.family;
  }, [selectedFont]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        setScrollOffset(window.scrollY);
        
        // Scroll spy logic
        const sections = [
          { id: 'home', element: document.body },
          { id: 'works', element: document.getElementById('section-works') },
          { id: 'feedback', element: document.getElementById('section-testimonials') },
          { id: 'contact', element: document.getElementById('footer') }
        ];

        const currentScroll = window.scrollY + window.innerHeight / 2;
        const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
        const isTop = window.scrollY < 100;

        if (isTop) {
          setActiveTab('home');
        } else if (isBottom) {
          setActiveTab('contact');
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element) {
              const top = section.id === 'home' ? 0 : section.element.offsetTop;
              if (currentScroll >= top) {
                setActiveTab(section.id);
                break;
              }
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [backgroundMotion]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please upload a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCustomWallpaper(result);
      setSelectedWallpaper(result);
    };
    reader.readAsDataURL(file);
  };

  const lightWallpapers = [
    {
      id: 'wall1',
      name: 'Wallpaper 1',
      path: '/wallpaper/wall1.png'
    },
    {
      id: 'wall2',
      name: 'Wallpaper 2',
      path: '/wallpaper/wall2.png'
    },
    {
      id: 'wall3',
      name: 'Wallpaper 3',
      path: '/wallpaper/wall3.png'
    },
    {
      id: 'wall4',
      name: 'Wallpaper 4',
      path: '/wallpaper/wall4.png'
    },
    {
      id: 'wall5',
      name: 'Wallpaper 5',
      path: '/wallpaper/wall5.png'
    },
    {
      id: 'wall6',
      name: 'Wallpaper 6',
      path: '/wallpaper/wall6.png'
    },
    {
      id: 'wall7',
      name: 'Wallpaper 7',
      path: '/wallpaper/wall7.png'
    }
  ];

  const darkWallpapers = [
    {
      id: 'darkwall1',
      name: 'Dark Wallpaper 1',
      path: '/wallpaper/darkui/darkwall1.png'
    },
    {
      id: 'darkwall2',
      name: 'Dark Wallpaper 2',
      path: '/wallpaper/darkui/darkwall2.png'
    },
    {
      id: 'darkwall3',
      name: 'Dark Wallpaper 3',
      path: '/wallpaper/darkui/darkwall3.png'
    },
    {
      id: 'darkwall4',
      name: 'Dark Wallpaper 4',
      path: '/wallpaper/darkui/darkwall4.png'
    },
    {
      id: 'darkwall5',
      name: 'Dark Wallpaper 5',
      path: '/wallpaper/darkui/darkwall5.png'
    },
    {
      id: 'darkwall6',
      name: 'Dark Wallpaper 6',
      path: '/wallpaper/darkui/darkwall6.png'
    },
    {
      id: 'darkwall7',
      name: 'Dark Wallpaper 7',
      path: '/wallpaper/darkui/darkwall7.png'
    }
  ];

  const wallpapers = isDarkWallpapers ? darkWallpapers : lightWallpapers;

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      company: "Stripe",
      linkedinLink: "",
      text: "Morgan's approach to design thinking transformed how our team tackles complex problems. Their ability to balance user needs with business goals is exceptional.",
      avatar: ""
    },
    {
      id: 2,
      name: "James Rodriguez",
      company: "Airbnb",
      linkedinLink: "",
      text: "Working with Morgan was a game-changer for our design system. Their attention to detail and strategic thinking helped us scale our product across multiple platforms seamlessly.",
      avatar: ""
    },
    {
      id: 3,
      name: "Emily Watson",
      company: "Shopify",
      linkedinLink: "",
      text: "Morgan brings a unique blend of creativity and analytical thinking. Their ethnographic research methods uncovered insights that shaped our entire product strategy.",
      avatar: ""
    },
    {
      id: 4,
      name: "Alex Thompson",
      company: "Notion",
      linkedinLink: "",
      text: "Our conversion rates doubled after Morgan redesigned our landing page. Sometimes simple changes make the biggest impact.",
      avatar: ""
    }
  ];

  const tools = [
    {
      id: 1,
      name: "Figma",
      category: "Design",
      description: "Interface design and prototyping",
      logo: "/tool-icons/Figma.svg"
    },
    {
      id: 2,
      name: "Figjam",
      category: "Ideation",
      description: "Whiteboarding and diagrams",
      logo: "/tool-icons/Figjam.svg"
    },
    {
      id: 3,
      name: "Maze",
      category: "Research",
      description: "User testing and insights",
      logo: "/tool-icons/Maze.svg"
    },
    {
      id: 4,
      name: "Webflow",
      category: "Development",
      description: "No-code website building",
      logo: "/tool-icons/Webflow.svg"
    },
    {
      id: 5,
      name: "Protopie",
      category: "Prototyping",
      description: "High-fidelity interactions",
      logo: "/tool-icons/Protopie.svg"
    },
    {
      id: 6,
      name: "Jitter",
      category: "Motion",
      description: "Motion design made simple",
      logo: "/tool-icons/Jitter.svg"
    },
    {
      id: 7,
      name: "Sketch",
      category: "Design",
      description: "Vector graphics and design",
      logo: "/tool-icons/Sketch.svg"
    },
    {
      id: 8,
      name: "Zeplin",
      category: "Handoff",
      description: "Design to dev collaboration",
      logo: "/tool-icons/Zeplin.svg"
    },
    {
      id: 9,
      name: "Miro",
      category: "Collaboration",
      description: "Visual workspace for teams",
      logo: "/tool-icons/Miro.svg"
    },
    {
      id: 10,
      name: "Whimsical",
      category: "Ideation",
      description: "Flowcharts and wireframes",
      logo: "/tool-icons/Whimsical.svg"
    }
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFooterPanelOpen, setIsFooterPanelOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Set<number>>(new Set());
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<typeof testimonials[0] | null>(null);
  const [isEditTestimonialOpen, setIsEditTestimonialOpen] = useState(false);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<number | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'cancel' | 'switch' | null>(null);
  const [pendingTestimonialId, setPendingTestimonialId] = useState<number | null>(null);
  const [caseStudies, setCaseStudies] = useState<Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    isHidden: boolean;
  }>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const caseStudyTemplates = [
    {
      id: 'blank',
      name: 'Blank Canvas',
      description: 'Start fresh and make your own layout.',
      icon: FileText,
      color: '#FF553E',
      mockProject: {
        title: 'Untitled Project',
        description: 'Start adding your content here',
        category: 'Project'
      }
    },
    {
      id: 'show-work',
      name: 'Show your Work',
      description: 'Perfect for showing what you built, designed, or created.',
      icon: Layers,
      color: '#FFB088',
      mockProject: {
        title: 'My Latest Project',
        description: 'Showcasing the work I built, designed, and created',
        category: 'Portfolio'
      }
    },
    {
      id: 'how-solved',
      name: 'How I Solved It',
      description: 'Tell the story behind a challenge you faced and how you solved it.',
      icon: MessageSquare,
      color: '#D97DD8',
      mockProject: {
        title: 'Problem Solving Case Study',
        description: 'The story of a challenge I faced and the solution I created',
        category: 'Problem Solving'
      }
    },
    {
      id: 'research',
      name: 'Research & Learnings',
      description: 'Best for sharing what you discovered or tested.',
      icon: Search,
      color: '#B47EE8',
      mockProject: {
        title: 'Research Findings',
        description: 'Insights and learnings from my research and testing',
        category: 'Research'
      }
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = caseStudyTemplates.find(t => t.id === templateId);
    if (template) {
      const newProject = {
        id: Date.now(),
        title: template.mockProject.title,
        description: template.mockProject.description,
        category: template.mockProject.category,
        image: '/casestudy.png',
        isHidden: false
      };
      setCaseStudies(prev => [...prev, newProject]);
    }
    setIsTemplateDialogOpen(false);
  };

  const handleToggleVisibility = (projectId: number) => {
    setCaseStudies(prev => prev.map(p => 
      p.id === projectId ? { ...p, isHidden: !p.isHidden } : p
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCaseStudies((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete !== null) {
      setCaseStudies(prev => prev.filter(p => p.id !== projectToDelete));
      setProjectToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const hasUnsavedChanges = () => {
    if (!editingTestimonial || selectedTestimonialId === null) return false;
    const originalTestimonial = testimonials.find(t => t.id === selectedTestimonialId);
    if (!originalTestimonial) return false;
    
    return (
      editingTestimonial.name !== originalTestimonial.name ||
      editingTestimonial.company !== originalTestimonial.company ||
      editingTestimonial.linkedinLink !== originalTestimonial.linkedinLink ||
      editingTestimonial.text !== originalTestimonial.text ||
      editingTestimonial.avatar !== originalTestimonial.avatar
    );
  };

  const handleAttemptClose = (action: 'close' | 'cancel') => {
    if (hasUnsavedChanges()) {
      setShowUnsavedWarning(true);
      setPendingAction(action);
    } else {
      if (action === 'close') {
        setIsEditTestimonialOpen(false);
        setSelectedTestimonialId(null);
      } else {
        setIsEditTestimonialOpen(false);
        setSelectedTestimonialId(null);
      }
    }
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedWarning(false);
    setEditingTestimonial(null);
    setIsEditTestimonialOpen(false);
    setSelectedTestimonialId(null);
    
    // If switching to another testimonial, open it after discarding
    if (pendingAction === 'switch' && pendingTestimonialId) {
      const testimonialToOpen = testimonials.find(t => t.id === pendingTestimonialId);
      if (testimonialToOpen) {
        setEditingTestimonial({ ...testimonialToOpen });
        setSelectedTestimonialId(testimonialToOpen.id);
        setIsEditTestimonialOpen(true);
      }
    }
    setPendingAction(null);
  };

  const handleEditTestimonialClick = (testimonial: typeof testimonials[0]) => {
    // If already editing a different testimonial with unsaved changes
    if (isEditTestimonialOpen && selectedTestimonialId !== testimonial.id && hasUnsavedChanges()) {
      setPendingTestimonialId(testimonial.id);
      setShowUnsavedWarning(true);
      setPendingAction('switch');
    } else {
      // No unsaved changes or editing the same one, open directly
      setEditingTestimonial(testimonial);
      setSelectedTestimonialId(testimonial.id);
      setIsEditTestimonialOpen(true);
    }
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  function SortableSectionItem({ id }: { id: string }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 'auto',
    };

    const labels: Record<string, string> = {
      works: 'My works',
      testimonials: 'Testimonials',
      toolbox: 'Toolbox',
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 transition-all ${
          isDragging ? 'opacity-50 shadow-lg scale-[1.02]' : 'hover:bg-accent/50'
        }`}
        data-testid={`item-block-${id}`}
      >
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-accent text-foreground/40">
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">{labels[id]}</span>
      </div>
    );
  }

  function SortableCard({ project }: { project: typeof caseStudies[0] }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: project.id });

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 200ms ease',
      zIndex: isDragging ? 50 : 'auto',
      cursor: isHoveringInteractive ? 'auto' : 'none'
    };

    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="group relative" 
        data-testid={`card-case-study-${project.id}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsHoveringInteractive(false);
        }}
      >
        <AnimatePresence>
          {isHovered && !isDragging && !isHoveringInteractive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed pointer-events-none z-[100] flex items-center gap-2 bg-[#FF553E] text-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate(-50%, -50%)',
                position: 'absolute'
              }}
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">View Case Study</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          className="bg-white border-0 rounded-2xl overflow-hidden relative"
          style={{ 
            boxShadow: isDragging 
              ? '0 0 0 1px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.15)' 
              : '0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
            opacity: isDragging ? 0.9 : 1,
          }}
          whileHover={{ 
            scale: 1.02,
            rotateX: 2,
            rotateY: -2,
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
          }}
          initial={{ scale: 1, rotateX: 0, rotateY: 0 }}
          animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        >
          <div 
            className="w-full h-56 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
            style={{
              background: 'linear-gradient(135deg, #FCF9F6 0%, #F9F5F1 50%, #F5F1ED 100%)'
            }}
            data-testid={`image-case-study-${project.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent" />
            <motion.img 
              src={project.image} 
              alt={project.title}
              className={`w-28 h-28 object-contain ${project.isHidden ? 'opacity-10' : 'opacity-20'}`}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
            {project.isHidden && (
              <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                <EyeOff className="w-3 h-3" />
                Hidden from live site
              </div>
            )}
          </div>
          
          <div className="p-6 pb-20">
            <div className="mb-3">
              <Badge 
                className="text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/50 border-none px-2 py-0"
                data-testid={`badge-case-study-category-${project.id}`}
              >
                {project.category}
              </Badge>
            </div>
            
            <h3 
              className="text-sm font-semibold tracking-tight text-foreground mb-1 leading-snug"
              data-testid={`text-case-study-title-${project.id}`}
            >
              {project.title}
            </h3>
            <p 
              className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2"
              data-testid={`text-case-study-description-${project.id}`}
            >
              {project.description}
            </p>
          </div>

          <div 
            className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-white via-white to-transparent rounded-b-2xl"
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
          >
            <button
              {...attributes}
              {...listeners}
              className="bg-white border border-border rounded-full px-3 py-2 flex items-center gap-2 hover-elevate cursor-grab active:cursor-grabbing"
              aria-roledescription="Reorder"
              data-testid={`button-drag-case-study-${project.id}`}
            >
              <GripVertical className="w-4 h-4 text-foreground" />
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleVisibility(project.id)}
                className={`border rounded-full px-4 py-2 flex items-center gap-2 hover-elevate cursor-pointer text-sm font-medium ${
                  project.isHidden 
                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                    : 'bg-white border-border text-foreground'
                }`}
                data-testid={`button-toggle-visibility-${project.id}`}
              >
                {project.isHidden ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Hidden</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Visible</span>
                  </>
                )}
              </button>
              
              <button
                className="bg-white border border-border rounded-full px-4 py-2 flex items-center gap-2 hover-elevate cursor-pointer text-sm font-medium"
                data-testid={`button-edit-case-study-bottom-${project.id}`}
              >
                <Pencil className="w-4 h-4 text-foreground" />
                <span className="text-foreground">Edit</span>
              </button>
              
              <button
                onClick={() => handleDeleteClick(project.id)}
                onMouseEnter={() => setIsHoveringInteractive(true)}
                onMouseLeave={() => setIsHoveringInteractive(false)}
                className="bg-white border border-border rounded-full w-10 h-10 flex items-center justify-center hover-elevate cursor-pointer"
                data-testid={`button-delete-case-study-${project.id}`}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-x-hidden relative" style={{ backgroundColor: '#F6F2EF' }}>
      {/* Previous wallpaper layer (stays visible during transition) */}
      {previousWallpaper && (
        <div 
          className="fixed inset-0"
          style={{ 
            backgroundImage: `url(${previousWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            filter: backgroundEffectType === 'blur' && backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : 'none',
            transform: `scale(${1.05 + (backgroundMotion ? scrollOffset * 0.00008 : 0)})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      )}
      {/* Current wallpaper layer with smooth fade-in */}
      {selectedWallpaper && (
        <div 
          key={selectedWallpaper}
          className="fixed inset-0 wallpaper-transition"
          style={{ 
            backgroundImage: `url(${selectedWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            filter: backgroundEffectType === 'blur' && backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : 'none',
            transform: `scale(${1.05 + (backgroundMotion ? scrollOffset * 0.00008 : 0)})`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      )}
      {/* Paper grain/noise overlay */}
      {selectedWallpaper && backgroundEffectType === 'grain' && grainIntensity > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{ 
            zIndex: 2,
            opacity: grainIntensity / 100,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 transition-all duration-300 relative z-10" style={{ marginRight: !isMobileOrTablet && (isThemePanelOpen || isEditTestimonialOpen || isFooterPanelOpen) ? '320px' : '0' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Floating Navbar */}
          <div 
            className="sticky top-0 pt-6 z-50 transition-all duration-300"
            style={{
              transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
          <Card 
            className="bg-white border-0 rounded-2xl px-8 py-4 mb-6 transition-shadow duration-300" 
            style={{ 
              boxShadow: isScrolled 
                ? '0 0 0 1px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.08)' 
                : '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' 
            }}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="cursor-pointer" data-testid="link-home">
                <svg width="166" height="33" viewBox="0 0 166 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" data-testid="logo-icon">
                  <path d="M15.4028 0.779664C15.6377 -0.259891 17.1189 -0.259886 17.3537 0.779669L18.9775 7.96851C19.1297 8.64225 19.9029 8.9625 20.4869 8.59371L26.7184 4.65866C27.6195 4.08962 28.6669 5.137 28.0979 6.03812L24.1628 12.2696C23.794 12.8537 24.1143 13.6268 24.788 13.779L31.9769 15.4028C33.0164 15.6377 33.0164 17.1189 31.9769 17.3537L24.788 18.9775C24.1143 19.1297 23.794 19.9029 24.1628 20.4869L28.0979 26.7184C28.6669 27.6195 27.6195 28.6669 26.7184 28.0979L20.4869 24.1628C19.9029 23.794 19.1297 24.1143 18.9775 24.788L17.3537 31.9769C17.1189 33.0164 15.6377 33.0164 15.4028 31.9769L13.779 24.788C13.6268 24.1143 12.8537 23.794 12.2696 24.1628L6.03812 28.0979C5.137 28.6669 4.08963 27.6195 4.65866 26.7184L8.59371 20.4869C8.9625 19.9029 8.64225 19.1297 7.96851 18.9775L0.779664 17.3537C-0.259891 17.1189 -0.259886 15.6377 0.779669 15.4028L7.96851 13.779C8.64225 13.6268 8.9625 12.8537 8.59371 12.2696L4.65866 6.03812C4.08962 5.137 5.137 4.08963 6.03812 4.65866L12.2696 8.59371C12.8537 8.9625 13.6268 8.64225 13.779 7.96851L15.4028 0.779664Z" fill="#FF553E"/>
                  <path d="M152.495 17.7614C152.495 13.6364 155.72 10.3864 159.745 10.3864C163.27 10.3864 165.645 12.6364 165.645 15.9864C165.645 20.1114 162.445 23.3614 158.395 23.3614C154.87 23.3614 152.495 21.1114 152.495 17.7614ZM155.495 17.5364C155.495 19.4864 156.67 20.7614 158.57 20.7614C160.82 20.7614 162.645 18.7364 162.645 16.2114C162.645 14.2364 161.47 12.9614 159.595 12.9614C157.345 12.9614 155.495 14.9864 155.495 17.5364Z" fill="currentColor"/>
                  <path d="M150.066 8.21142C149.166 8.21142 148.541 7.53642 148.541 6.68643C148.541 5.58642 149.516 4.58643 150.641 4.58643C151.516 4.58643 152.166 5.23642 152.166 6.11143C152.166 7.18642 151.166 8.21142 150.066 8.21142ZM146.266 23.0614L148.216 10.7114H151.141L149.191 23.0614H146.266Z" fill="currentColor"/>
                  <path d="M143.064 23.0614H140.139L143.064 4.46143H146.014L143.064 23.0614Z" fill="currentColor"/>
                  <path d="M125.591 17.7614C125.591 13.6364 128.816 10.3864 132.841 10.3864C136.366 10.3864 138.741 12.6364 138.741 15.9864C138.741 20.1114 135.541 23.3614 131.491 23.3614C127.966 23.3614 125.591 21.1114 125.591 17.7614ZM128.591 17.5364C128.591 19.4864 129.766 20.7614 131.666 20.7614C133.916 20.7614 135.741 18.7364 135.741 16.2114C135.741 14.2364 134.566 12.9614 132.691 12.9614C130.441 12.9614 128.591 14.9864 128.591 17.5364Z" fill="currentColor"/>
                  <path d="M118.183 10.7114H119.933L120.183 9.16142C120.683 6.06143 122.408 4.46143 125.233 4.46143C125.733 4.46143 126.283 4.48643 126.733 4.58643L126.333 7.11143C125.983 7.11143 125.658 7.08642 125.308 7.08642C123.983 7.08642 123.308 7.71143 123.083 9.16142L122.833 10.7114H125.733L125.333 13.1614H122.458L120.883 23.0614H117.983L119.558 13.1614H117.783L118.183 10.7114Z" fill="currentColor"/>
                  <path d="M106.761 23.0614H103.711V10.7114H106.536L106.786 12.3114C107.561 11.0614 109.061 10.3364 110.736 10.3364C113.836 10.3364 115.436 12.2614 115.436 15.4614V23.0614H112.386V16.1864C112.386 14.1114 111.361 13.1114 109.786 13.1114C107.911 13.1114 106.761 14.4114 106.761 16.4114V23.0614Z" fill="currentColor"/>
                  <path d="M87.6544 16.6114C87.6544 13.0114 90.0044 10.3114 93.5294 10.3114C95.3794 10.3114 96.8294 11.0864 97.5544 12.4114L97.7294 10.7114H100.554V22.4364C100.554 26.5614 98.0794 29.1364 94.0794 29.1364C90.5294 29.1364 88.1044 27.1114 87.7294 23.8114H90.7794C90.9794 25.4114 92.2044 26.3614 94.0794 26.3614C96.1794 26.3614 97.5294 25.0364 97.5294 22.9864V20.9364C96.7544 22.0864 95.2294 22.8114 93.4544 22.8114C89.9544 22.8114 87.6544 20.1864 87.6544 16.6114ZM90.7294 16.5364C90.7294 18.6114 92.0544 20.1614 94.0544 20.1614C96.1544 20.1614 97.4544 18.6864 97.4544 16.5364C97.4544 14.4364 96.1794 12.9864 94.0544 12.9864C92.0294 12.9864 90.7294 14.5114 90.7294 16.5364Z" fill="currentColor"/>
                  <path d="M83.6782 8.2364C82.6282 8.2364 81.8032 7.4114 81.8032 6.3864C81.8032 5.3614 82.6282 4.5614 83.6782 4.5614C84.6782 4.5614 85.5032 5.3614 85.5032 6.3864C85.5032 7.4114 84.6782 8.2364 83.6782 8.2364ZM82.1532 23.0614V10.7114H85.2032V23.0614H82.1532Z" fill="currentColor"/>
                  <path d="M69.631 19.3114H72.531C72.556 20.3864 73.356 21.0614 74.756 21.0614C76.181 21.0614 76.956 20.4864 76.956 19.5864C76.956 18.9614 76.631 18.5114 75.531 18.2614L73.306 17.7364C71.081 17.2364 70.006 16.1864 70.006 14.2114C70.006 11.7864 72.056 10.3364 74.906 10.3364C77.681 10.3364 79.556 11.9364 79.581 14.3364H76.681C76.656 13.2864 75.956 12.6114 74.781 12.6114C73.581 12.6114 72.881 13.1614 72.881 14.0864C72.881 14.7864 73.431 15.2364 74.481 15.4864L76.706 16.0114C78.781 16.4864 79.831 17.4364 79.831 19.3364C79.831 21.8364 77.706 23.3864 74.656 23.3864C71.581 23.3864 69.631 21.7364 69.631 19.3114Z" fill="currentColor"/>
                  <path d="M62.1899 23.3864C58.5149 23.3864 55.9399 20.7114 55.9399 16.8864C55.9399 13.0114 58.4649 10.3364 62.0899 10.3364C65.7899 10.3364 68.1399 12.8114 68.1399 16.6614V17.5864L58.8399 17.6114C59.0649 19.7864 60.2149 20.8864 62.2399 20.8864C63.9149 20.8864 65.0149 20.2364 65.3649 19.0614H68.1899C67.6649 21.7614 65.4149 23.3864 62.1899 23.3864ZM62.1149 12.8364C60.3149 12.8364 59.2149 13.8114 58.9149 15.6614H65.1149C65.1149 13.9614 63.9399 12.8364 62.1149 12.8364Z" fill="currentColor"/>
                  <path d="M46.2614 23.3864C42.6864 23.3864 40.4614 20.7614 40.4614 16.9364C40.4614 13.0864 42.7114 10.3364 46.4364 10.3364C48.1614 10.3364 49.6864 11.0614 50.4614 12.2864V4.46143H53.4864V23.0614H50.6864L50.4864 21.1364C49.7364 22.5614 48.1364 23.3864 46.2614 23.3864ZM46.9364 20.5864C49.0614 20.5864 50.4364 19.0614 50.4364 16.8364C50.4364 14.6114 49.0614 13.0614 46.9364 13.0614C44.8114 13.0614 43.5114 14.6364 43.5114 16.8364C43.5114 19.0364 44.8114 20.5864 46.9364 20.5864Z" fill="currentColor"/>
                </svg>
              </Link>

              {/* Nav Actions - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-11 w-11"
                  data-testid="button-insights"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-11 w-11"
                  data-testid="button-notifications"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-11 w-11"
                  onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
                  data-testid="button-theme"
                >
                  <Paintbrush className="w-5 h-5" />
                </Button>
                <Button 
                  className="bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                  data-testid="button-publish-site"
                >
                  Publish Site
                </Button>
                <Avatar className="w-11 h-11" data-testid="avatar-user">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-base" style={{ backgroundColor: '#FF553E', color: '#FFFFFF' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full h-11 w-11"
                      data-testid="button-menu"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80">
                    <div className="flex flex-col gap-4 mt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-11 h-11" data-testid="avatar-user-mobile">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-base" style={{ backgroundColor: '#FF553E', color: '#FFFFFF' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-foreground/50">{user.role}</div>
                        </div>
                      </div>
                      
                      <Button 
                        className="bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors w-full justify-center"
                        data-testid="button-publish-site-mobile"
                      >
                        Publish Site
                      </Button>
                      
                      <div className="border-t pt-4 flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          className="rounded-full h-11 w-full justify-start gap-3"
                          data-testid="button-insights-mobile"
                        >
                          <Sparkles className="w-5 h-5" />
                          <span>Insights</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-full h-11 w-full justify-start gap-3"
                          data-testid="button-notifications-mobile"
                        >
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-full h-11 w-full justify-start gap-3"
                          onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
                          data-testid="button-theme-mobile"
                        >
                          <Paintbrush className="w-5 h-5" />
                          <span>Theme</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </Card>
        </div>

        <main className="pb-6">
          {/* Profile Card */}
          <div className="z-10 mb-3">
            <Card className="bg-white border-0 rounded-2xl relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
              {/* Edit Button - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full h-11 w-11"
                  data-testid="button-edit-profile"
                >
                  <Pencil className="w-5 h-5" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="p-6 sm:p-8 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                          <Magnetic intensity={0.2} range={100}>
                            <TooltipTrigger asChild>
                              <motion.div 
                                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                                animate={{ 
                                  opacity: 1, 
                                  filter: "blur(0px)", 
                                  scale: 1,
                                  rotateX: isHovering ? mousePosition.y * -20 : 0,
                                  rotateY: isHovering ? mousePosition.x * 20 : 0,
                                }}
                                whileHover={{ 
                                  scale: 1.05,
                                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => {
                                  setIsHovering(false);
                                  setMousePosition({ x: 0, y: 0 });
                                }}
                                transition={{ 
                                  type: "spring",
                                  stiffness: 150,
                                  damping: 20,
                                  mass: 0.5
                                }}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 bg-[#f6f2ef] preserve-3d" 
                                style={{ 
                                  backgroundColor: '#F5F3F1',
                                  perspective: "1000px"
                                }} 
                                data-testid="avatar-profile"
                              >
                                {!imageLoaded && (
                                  <div 
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                                      animation: 'shimmer 1.5s infinite'
                                    }}
                                  />
                                )}
                                <img 
                                  src="/advanced.png" 
                                  alt={user.name} 
                                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                  onLoad={() => setImageLoaded(true)}
                                  style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                                />
                              </motion.div>
                            </TooltipTrigger>
                          </Magnetic>
                      <TooltipContent 
                        side="top" 
                        className="bg-[#1A1A1A] text-white border-0 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl"
                      >
                        <span className="text-sm font-medium">Happy to have you here</span>
                        <img src="/handshake.png" alt="Handshake" className="w-5 h-5 object-contain" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="flex-1">
                    <motion.h1 
                      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-semibold mb-2 font-heading" 
                      data-testid="text-user-name"
                    >
                      Hey, I'm Shai!
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                      className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl" 
                      data-testid="text-user-role"
                    >
                      A 0→1 Product Designer with 6 years of experience. I design and 
                      develop digital products, create prototypes, and design interfaces.
                    </motion.p>
                  </div>
                </div>
              </div>
              
              {/* Skills Banner Strip */}
              <div 
                className="relative overflow-hidden border-t border-border/10 py-3 bg-[#F8F7F5] rounded-b-2xl" 
                data-testid="container-categories"
              >
                <div className="flex gap-4 animate-scroll px-8 opacity-40">
                  {[...user.categories, ...user.categories].map((category, index) => (
                    <div key={index} className="flex items-center gap-3 shrink-0">
                      <span className="text-[12px] font-medium whitespace-nowrap uppercase text-[#0A0A0A] tracking-normal">
                        {category}
                      </span>
                      <Sparkle className="w-2.5 h-2.5 fill-[#0A0A0A] text-[#0A0A0A]" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-3">
            <AnimatePresence mode="popLayout">
              {sectionOrder.map((sectionId, index) => {
                if (sectionId === 'works') {
                  return (
                    <motion.div
                      key="works"
                      layout
                      id="section-works"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.01 }}
                      transition={{
                        duration: 0.7,
                        ease: [0.21, 0.47, 0.32, 0.98],
                        delay: index * 0.1
                      }}
                    >
                  <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-section-title">
                        My works
                      </h2>
                      <div className="flex items-center gap-3">
                        <motion.svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-foreground/30"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </motion.svg>
                        {caseStudies.length > 0 && (
                          <Button
                            onClick={() => setIsTemplateDialogOpen(true)}
                            variant="outline"
                            size="icon"
                            className="rounded-full h-11 w-11"
                            data-testid="button-add-case-study-header"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {caseStudies.length === 0 ? (
                      <div 
                        className="border border-border/30 rounded-2xl p-10 shadow-none"
                        style={{
                          backgroundColor: '#F6F2EF',
                          boxShadow: 'inset 0 3px 8px 0 rgb(0 0 0 / 0.03), inset 0 -3px 8px 0 rgb(0 0 0 / 0.02)'
                        }}
                      >
                        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4">
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                            <img src="/casestudy.png" alt="Case Study" className="w-20 h-20" />
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-state-title">
                            Upload your first case study
                          </h3>
                          <p className="text-base text-foreground/60 mb-6" data-testid="text-empty-state-description">
                            Show off your best work
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                            <Button 
                              onClick={() => setIsTemplateDialogOpen(true)}
                              className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors flex items-center justify-center gap-2"
                              data-testid="button-add-case-study"
                            >
                              <Plus className="w-5 h-5" />
                              Add case study
                            </Button>
                            <div 
                              className="w-full sm:w-auto bg-white border border-border rounded-full px-6 py-3 flex items-center justify-center gap-3 hover-elevate cursor-pointer"
                              data-testid="button-write-using-ai"
                            >
                              <Sparkles className="w-5 h-5 text-foreground" />
                              <span className="text-base font-medium text-foreground">
                                Write using AI
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={caseStudies.map(p => p.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {caseStudies.map((project) => (
                              <SortableCard key={project.id} project={project} />
                            ))}
                        
                            {/* Add New Case Study Card */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="group"
                              data-testid="card-add-case-study"
                            >
                              {caseStudies.length >= 2 ? (
                                <div
                                  className="w-full h-full border border-border/30 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[360px] gap-4 relative"
                                  style={{ 
                                    backgroundColor: '#F6F2EF',
                                    boxShadow: 'inset 0 3px 8px 0 rgb(0 0 0 / 0.03), inset 0 -3px 8px 0 rgb(0 0 0 / 0.02)'
                                  }}
                                >
                                  <div className="flex flex-col items-center text-center max-w-xs">
                                    <div 
                                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                      style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)'
                                      }}
                                    >
                                      <Crown className="w-8 h-8 text-foreground/70" />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold mb-2" data-testid="text-upgrade-title">
                                      Upgrade to PRO
                                    </h3>
                                    <p className="text-sm text-foreground/60 mb-4" data-testid="text-upgrade-description">
                                      You've used your free case studies. Get lifetime access to add unlimited case studies and unlock all premium features.
                                    </p>
                                    
                                    <StardustButton 
                                      data-testid="button-upgrade-to-pro"
                                    >
                                      {isMobileOrTablet ? 'Upgrade Now' : 'Get Lifetime Access'}
                                    </StardustButton>
                                    
                                    <div className="mt-6 flex items-center gap-2 text-xs text-foreground/50">
                                      <Lock className="w-3 h-3" />
                                      <span>Free plan: 2 case studies only</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="w-full h-full border border-border/30 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[360px] gap-3"
                                  style={{ 
                                    backgroundColor: '#F6F2EF',
                                    boxShadow: 'inset 0 3px 8px 0 rgb(0 0 0 / 0.03), inset 0 -3px 8px 0 rgb(0 0 0 / 0.02)'
                                  }}
                                >
                                  <Button 
                                    onClick={() => setIsTemplateDialogOpen(true)}
                                    className="bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors flex items-center gap-2"
                                    data-testid="button-add-case-study-grid"
                                  >
                                    <Plus className="w-5 h-5" />
                                    Add case study
                                  </Button>
                                  <div 
                                    className="bg-white border border-border rounded-full px-6 py-3 flex items-center gap-2 hover-elevate cursor-pointer"
                                    data-testid="button-write-using-ai-grid"
                                  >
                                    <Sparkles className="w-5 h-5 text-foreground" />
                                    <span className="text-base font-medium text-foreground">
                                      Write using AI
                                    </span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </Card>
                </motion.div>
              );
            }

            if (sectionId === 'about') {
              return (
                <motion.div
                  key="about"
                  layout
                  id="section-about"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.21, 0.47, 0.32, 0.98],
                    delay: index * 0.1
                  }}
                >
                  <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-6" data-testid="text-about-title">
                      About Me
                    </h2>
                    <div className="space-y-4 text-foreground/80 leading-relaxed mb-8">
                      <p data-testid="text-about-description-1">
                        I am a passionate product designer dedicated to creating intuitive and impactful digital experiences. With over 6 years of experience, I specialize in bridging the gap between user needs and business goals through thoughtful design and prototyping.
                      </p>
                    </div>

                    {/* Pin Board (Authentic Pegboard) */}
                    <div className="relative group/pegboard mb-8">
                      {/* Realistic Board Depth/Shadow - Even more subtle */}
                      <div className="absolute inset-0 bg-black/5 rounded-2xl translate-y-[2px] translate-x-[1px] blur-[3px] pointer-events-none" />

                      <div ref={pinBoardRef} className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-[#FFFFFF] rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] z-10 overflow-visible border border-black/[0.03]">
                        
                        {/* Authentic Pegboard Holes Pattern - Centered Repeating Background */}
                        <div
                          className="absolute inset-0 pointer-events-none rounded-2xl"
                          style={{
                            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)`,
                            backgroundSize: '36px 36px',
                            backgroundPosition: 'center',
                            padding: '18px',
                            backgroundOrigin: 'content-box',
                            backgroundClip: 'content-box',
                          }}
                        />

                        {/* Subtle Material Grain */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] overflow-hidden" />

                        {/* Lighting */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] via-transparent to-white/[0.05] pointer-events-none overflow-hidden" />
                        
                        {/* Photo 1 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: -5, left: isMobile ? '15%' : '20%', top: isMobile ? '18%' : '25%', x: '-50%', y: '-50%' }}
                        animate={{ left: isMobile ? '15%' : '20%', top: isMobile ? '18%' : '25%', x: '-50%', y: '-50%' }}
                        className="absolute w-24 sm:w-28 md:w-36 lg:w-40 aspect-[4/3] p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing z-10 rounded-sm"
                        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)' }}
                      >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                          <img 
                            src="/portraits/portrait1.png" 
                            alt="Portrait 1" 
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                        {/* Realistic Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-4 w-[1px] h-2 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                      {/* Photo 2 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: 3, left: isMobile ? '72%' : '80%', top: isMobile ? '22%' : '30%', x: '-50%', y: '-50%' }}
                        animate={{ left: isMobile ? '72%' : '80%', top: isMobile ? '22%' : '30%', x: '-50%', y: '-50%' }}
                        className="absolute w-28 sm:w-32 md:w-40 lg:w-44 aspect-square p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing z-20 rounded-sm"
                        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)' }}
                      >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                          <img 
                            src="/portraits/portrait2.png" 
                            alt="Portrait 2" 
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                        {/* Realistic Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-4 w-[1px] h-2 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                      {/* Photo 3 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: -2, left: isMobile ? '18%' : '25%', top: isMobile ? '58%' : '75%', x: '-50%', y: '-50%' }}
                        animate={{ left: isMobile ? '18%' : '25%', top: isMobile ? '58%' : '75%', x: '-50%', y: '-50%' }}
                        className="absolute w-24 sm:w-28 md:w-36 lg:w-40 aspect-[3/4] p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing z-30 rounded-sm"
                        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)' }}
                      >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                          <img 
                            src="/portraits/portrait3.png" 
                            alt="Portrait 3" 
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                        {/* Realistic Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-4 w-[1px] h-2 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                      {/* Photo 4 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: 4, left: isMobile ? '68%' : '75%', top: isMobile ? '68%' : '75%', x: '-50%', y: '-50%' }}
                        animate={{ left: isMobile ? '68%' : '75%', top: isMobile ? '68%' : '75%', x: '-50%', y: '-50%' }}
                        className="absolute w-20 sm:w-24 md:w-32 lg:w-36 aspect-[4/3] p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing z-40 rounded-sm"
                        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)' }}
                      >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                          <img 
                            src="/portraits/portrait4.png" 
                            alt="Portrait 4" 
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                        {/* Realistic Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-4 w-[1px] h-2 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                      {/* Sticker 1 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: -15, left: isMobile ? '45%' : '44%', top: isMobile ? '40%' : '48%', x: '-50%', y: '-50%' }}
                        animate={{ left: isMobile ? '45%' : '44%', top: isMobile ? '40%' : '48%', x: '-50%', y: '-50%' }}
                        className="absolute w-20 sm:w-24 md:w-32 lg:w-36 aspect-square cursor-grab active:cursor-grabbing z-50"
                        whileDrag={{ scale: 1.1, zIndex: 60 }}
                      >
                        <img 
                          src="/portraits/sticker1.png" 
                          alt="Sticker 1" 
                          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                        />
                        {/* Realistic Pin for Sticker */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-3.5 h-3.5 rounded-full bg-[#3B82F6] shadow-[0_1.5px_3px_rgba(0,0,0,0.2),inset_0_-0.75px_1.5px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-3 w-[1px] h-1.5 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                      {/* Sticker 2 */}
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={pinBoardRef}
                        dragElastic={0.1}
                        onDragStart={() => playPick()}
                        onDragEnd={() => playPlace()}
                        initial={{ rotate: 10, left: isMobile ? '50%' : '55%', top: isMobile ? '85%' : '60%' }}
                        className="absolute w-24 sm:w-28 md:w-36 lg:w-40 aspect-square cursor-grab active:cursor-grabbing z-50"
                        style={{
                          x: "-50%",
                          y: "-50%"
                        }}
                        whileDrag={{ scale: 1.1, zIndex: 60 }}
                      >
                        <img 
                          src="/portraits/sticker2.png" 
                          alt="Sticker 2" 
                          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                        />
                        {/* Realistic Pin for Sticker */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-20">
                          {/* Pin Head (Plastic) */}
                          <div className="w-3.5 h-3.5 rounded-full bg-[#3B82F6] shadow-[0_1.5px_3px_rgba(0,0,0,0.2),inset_0_-0.75px_1.5px_rgba(0,0,0,0.2)] relative">
                            {/* Highlight/Reflection */}
                            <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/40 rounded-full blur-[0.5px]" />
                            {/* Subtle Depth Gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent" />
                          </div>
                          {/* Pin Needle Shadow */}
                          <div className="absolute top-3 w-[1px] h-1.5 bg-black/20 blur-[0.5px] -rotate-12" />
                        </div>
                      </motion.div>

                    </div>
                  </div>
                    <div className="text-center text-[10px] text-foreground/20 font-medium tracking-widest uppercase pointer-events-none mb-4">
                      Try moving things around :)
                    </div>
                  </Card>
                </motion.div>
              );
            }

            if (sectionId === 'work_experience') {
    return (
      <motion.div
        key="work-experience"
        layout
        id="section-work-experience"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.01 }}
        transition={{
          duration: 0.7,
          ease: [0.21, 0.47, 0.32, 0.98],
          delay: index * 0.1
        }}
      >
        <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-work-experience-title">
              Work Experience
            </h2>
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full h-11 w-11"
              data-testid="button-add-work-experience"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {workExperiences.map((exp) => (
              <div 
                key={exp.id} 
                className="group flex gap-5 p-4 rounded-2xl border border-border/30 bg-[#F5F3F1] hover-elevate transition-all duration-300"
                data-testid={`card-work-experience-${exp.id}`}
              >
                <div className="shrink-0">
                  <Avatar className="w-12 h-12 rounded-xl border border-border/50">
                    <AvatarImage src={exp.logo} alt={exp.company} />
                    <AvatarFallback className="bg-muted text-xs">{exp.company.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base truncate" data-testid={`text-experience-role-${exp.id}`}>
                      {exp.role}
                    </h3>
                    <span className="text-xs font-medium text-foreground/40 shrink-0" data-testid={`text-experience-period-${exp.id}`}>
                      {exp.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground/60" data-testid={`text-experience-company-${exp.id}`}>
                      {exp.company}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2" data-testid={`text-experience-description-${exp.id}`}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  if (sectionId === 'testimonials') {
                return (
                  <motion.div
                    key="testimonials"
                    layout
                    id="section-testimonials"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                      delay: index * 0.1
                    }}
                  >
                  <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-testimonials-title">
                        Testimonials
                      </h2>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-11 w-11"
                        data-testid="button-add-testimonial"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="mt-6 -mx-10 px-10 overflow-visible">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full overflow-visible"
                      >
                        <div className="overflow-visible">
                          <CarouselContent className="-ml-6">
                            {testimonials.map((testimonial, idx) => (
                              <CarouselItem key={testimonial.id} className="pl-6 md:basis-1/2 overflow-visible py-4">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, amount: 0.2 }}
                                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                                  className={`group rounded-2xl p-6 flex flex-col relative transition-all duration-300 h-full ${
                                    selectedTestimonialId === testimonial.id
                                      ? 'bg-foreground/5'
                                      : 'bg-white hover-elevate'
                                  }`}
                                  data-testid={`card-testimonial-${testimonial.id}`}
                                  style={{
                                    backgroundColor: selectedTestimonialId === testimonial.id ? 'rgba(0, 0, 0, 0.04)' : '#FFFFFF',
                                    boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.04)'
                                  }}
                                >
                                  <div className="mb-4 mt-2 flex items-center justify-between">
                                    <svg width="24" height="20" viewBox="0 0 40 32" fill="none" className="text-foreground/20">
                                      <path d="M0 13.5C0 7.5 2.5 2.5 7.5 -1.5L10.5 1.5C7 4.5 5 8 5 12C5 12.5 5.1 13 5.2 13.5C6 13 7 12.5 8.5 12.5C10.5 12.5 12 13 13.5 14.5C15 16 15.5 18 15.5 20C15.5 22 15 24 13.5 25.5C12 27 10.5 27.5 8.5 27.5C6 27.5 4 26.5 2.5 24.5C1 22.5 0 19.5 0 15.5V13.5ZM24 13.5C24 7.5 26.5 2.5 31.5 -1.5L34.5 1.5C31 4.5 29 8 29 12C29 12.5 29.1 13 29.2 13.5C30 13 31 12.5 32.5 12.5C34.5 12.5 36 13 37.5 14.5C39 16 39.5 18 39.5 20C39.5 22 39 24 37.5 25.5C36 27 34.5 27.5 32.5 27.5C30 27.5 28 26.5 26.5 24.5C25 22.5 24 19.5 24 15.5V13.5Z" fill="currentColor"/>
                                    </svg>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleEditTestimonialClick(testimonial)}
                                      data-testid={`button-edit-testimonial-${testimonial.id}`}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <p className="text-base leading-relaxed mb-8 flex-1 text-foreground/80" data-testid={`text-testimonial-content-${testimonial.id}`}>
                                    {testimonial.text}
                                  </p>

                                  <div className="flex items-center justify-between gap-3 mt-auto">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-10 h-10 shrink-0">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback style={{ backgroundColor: '#FFB088', color: '#FFFFFF' }}>
                                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>

                                      <div>
                                        <h3 className="font-semibold text-sm mb-0.5 text-foreground" data-testid={`text-testimonial-name-${testimonial.id}`}>
                                          {testimonial.name}
                                        </h3>
                                        <p className="text-xs text-foreground/60" data-testid={`text-testimonial-role-${testimonial.id}`}>
                                          {testimonial.company}
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={testimonial.linkedinLink || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-foreground/20 hover:text-[#0077B5] transition-colors p-2 -mr-2"
                                      data-testid={`link-testimonial-linkedin-${testimonial.id}`}
                                    >
                                      <Linkedin className="w-5 h-5" />
                                    </a>
                                  </div>
                                </motion.div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </div>
                        <div className="flex justify-center gap-1.5 mt-4">
                          <CarouselPrevious className="static h-10 w-10 rounded-full border-border/50 bg-white shadow-sm transition-all translate-y-0" />
                          <CarouselNext className="static h-10 w-10 rounded-full border-border/50 bg-white shadow-sm transition-all translate-y-0" />
                        </div>
                      </Carousel>
                    </div>
                  </Card>
                </motion.div>
              );
            }

              if (sectionId === 'toolbox') {
                return (
                  <motion.div
                    key="toolbox"
                    layout
                    id="section-toolbox"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                      delay: index * 0.1
                    }}
                  >
                  <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3 overflow-visible" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-toolbox-title">
                        Toolbox
                      </h2>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-11 w-11"
                        data-testid="button-add-tool"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="relative mt-2 overflow-x-hidden overflow-y-visible -mx-6 px-6">
                      {/* Left fade */}
                      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                      {/* Right fade */}
                      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                      <div className="flex group">
                        <div className="flex animate-scroll group-hover:[animation-play-state:paused] py-4">
                          {[...tools, ...tools].map((tool, idx) => (
                            <TooltipProvider key={`${tool.id}-${idx}`}>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="bg-white border border-border/30 rounded-2xl p-3 md:p-4 hover-elevate mx-2 shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 cursor-default"
                                    data-testid={`card-tool-${tool.id}-${idx}`}
                                  >
                                    <img src={tool.logo} alt={tool.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  sideOffset={5}
                                  className="bg-foreground text-background border-none px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg z-[100]"
                                >
                                  <p>{tool.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>

      {/* Footer Section */}
      <motion.footer
        id="footer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pb-20"
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="relative bg-white p-8 shadow-sm rounded-2xl overflow-hidden"
            style={selectedWallpaper ? {
              WebkitMaskImage: `radial-gradient(circle at 0% 5.882352941176471%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 11.764705882352942%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 17.647058823529413%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 23.529411764705884%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 29.411764705882355%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 35.294117647058826%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 41.1764705882353%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 47.05882352941177%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 52.94117647058824%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 58.82352941176471%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 64.70588235294119%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 70.58823529411765%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 76.47058823529412%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 82.3529411764706%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 88.23529411764707%, transparent 5.5px, black 5.5px), radial-gradient(circle at 0% 94.11764705882354%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 5.882352941176471%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 11.764705882352942%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 17.647058823529413%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 23.529411764705884%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 29.411764705882355%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 35.294117647058826%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 41.1764705882353%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 47.05882352941177%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 52.94117647058824%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 58.82352941176471%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 64.70588235294119%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 70.58823529411765%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 76.47058823529412%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 82.3529411764706%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 88.23529411764707%, transparent 5.5px, black 5.5px), radial-gradient(circle at 100% 94.11764705882354%, transparent 5.5px, black 5.5px), radial-gradient(circle at 2.5641025641025643% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 5.128205128205129% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 7.692307692307693% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 10.256410256410257% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 12.820512820512821% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 15.384615384615387% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 17.94871794871795% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 20.512820512820515% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 23.07692307692308% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 25.641025641025642% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 28.205128205128208% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 30.769230769230774% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 33.333333333333336% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 35.8974358974359% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 38.46153846153847% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 41.02564102564103% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 43.58974358974359% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 46.15384615384616% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 48.71794871794872% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 51.282051282051285% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 53.846153846153854% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 56.410256410256416% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 58.97435897435898% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 61.53846153846155% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 64.1025641025641% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 66.66666666666667% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 69.23076923076924% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 71.7948717948718% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 74.35897435897436% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 76.92307692307693% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 79.48717948717949% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 82.05128205128206% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 84.61538461538463% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 87.17948717948718% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 89.74358974358975% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 92.30769230769232% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 94.87179487179488% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 97.43589743589745% 0%, transparent 5.5px, black 5.5px), radial-gradient(circle at 2.5641025641025643% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 5.128205128205129% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 7.692307692307693% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 10.256410256410257% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 12.820512820512821% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 15.384615384615387% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 17.94871794871795% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 20.512820512820515% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 23.07692307692308% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 25.641025641025642% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 28.205128205128208% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 30.769230769230774% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 33.333333333333336% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 35.8974358974359% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 38.46153846153847% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 41.02564102564103% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 43.58974358974359% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 46.15384615384616% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 48.71794871794872% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 51.282051282051285% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 53.846153846153854% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 56.410256410256416% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 58.97435897435898% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 61.53846153846155% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 64.1025641025641% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 66.66666666666667% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 69.23076923076924% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 71.7948717948718% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 74.35897435897436% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 76.92307692307693% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 79.48717948717949% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 82.05128205128206% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 84.61538461538463% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 87.17948717948718% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 89.74358974358975% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 92.30769230769232% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 94.87179487179488% 100%, transparent 5.5px, black 5.5px), radial-gradient(circle at 97.43589743589745% 100%, transparent 5.5px, black 5.5px)`,
              WebkitMaskComposite: 'source-in'
            } : {}}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2.5 border-b border-border/10 group gap-1 sm:gap-4"
                data-testid="footer-item-resume"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <span className="text-sm sm:text-base text-foreground/50">Resume</span>
                <button
                  onClick={() => setIsResumeDialogOpen(true)}
                  className="group/resume text-sm sm:text-base font-medium hover:underline underline-offset-4 cursor-pointer text-left sm:text-right flex items-center justify-start sm:justify-end gap-1.5"
                >
                  <span>View Resume</span>
                </button>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2.5 border-b border-border/10 group gap-1 sm:gap-4"
                data-testid="footer-item-mail"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="text-sm sm:text-base text-foreground/50">Mail</span>
                <a
                  href="mailto:rakshit.design@gmail.com"
                  className="text-sm sm:text-base font-medium hover:underline underline-offset-4 break-all sm:break-normal text-left sm:text-right"
                >
                  rakshit.design@gmail.com
                </a>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2.5 border-b border-border/10 group gap-1 sm:gap-4"
                data-testid="footer-item-phone"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-sm sm:text-base text-foreground/50">Phone number</span>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        className={`text-sm sm:text-base font-medium transition-all duration-300 min-w-0 sm:min-w-[180px] text-left sm:text-right flex items-center justify-start sm:justify-end gap-2 ${!isCopied ? 'hover:underline underline-offset-4 cursor-pointer' : 'cursor-default'}`}
                        onClick={() => {
                          if (!isCopied) {
                            navigator.clipboard.writeText("+12065714546");
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }
                        }}
                        data-testid="button-copy-phone"
                      >
                        {isCopied ? (
                          <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-[#FF553E]"
                          >
                            Copied <ThumbsUp className="w-4 h-4" />
                          </motion.span>
                        ) : (
                          <span>+1 (206)-571-4546</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {!isCopied && (
                      <TooltipContent className="bg-foreground text-background border-none px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                        <p>Copy</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2.5 border-b border-border/10 group gap-1 sm:gap-4"
                data-testid="footer-item-blogs"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-sm sm:text-base text-foreground/50">Blogs</span>
                <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium hover:underline underline-offset-4 text-left sm:text-right">Medium</a>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-2.5 border-b border-border/10 group gap-1 sm:gap-4"
                data-testid="footer-item-socials"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="text-sm sm:text-base text-foreground/50">Socials</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium hover:underline underline-offset-4">LinkedIn</a>
                  <span className="text-foreground/20">•</span>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium hover:underline underline-offset-4">X</a>
                  <span className="text-foreground/20">•</span>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium hover:underline underline-offset-4">Instagram</a>
                  <span className="text-foreground/20">•</span>
                  <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium hover:underline underline-offset-4">Dribbble</a>
                </div>
              </motion.div>
            </div>

          <div className="pt-6 flex flex-col items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={() => setIsFooterPanelOpen(true)}
              data-testid="button-edit-footer"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <svg
              width="120"
              height="40"
              viewBox="0 0 120 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground/20"
            >
              <motion.path
                d="M10 20C17 13 23 27 30 20C37 13 43 27 50 20C57 13 63 27 70 20C77 13 83 27 90 20C97 13 103 27 110 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
              />
            </svg>
            <CrypticText text="© SHAI KRISHNA" className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  </motion.footer>
</main>
</div>
</div>

      {/* Resume PDF Dialog */}
      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] p-0 overflow-hidden border-none bg-background shadow-2xl rounded-2xl">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsResumeDialogOpen(false)}
                className="h-8 w-8 rounded-full bg-white hover:bg-white/90 text-black shadow-lg border border-border/50 transition-all"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 w-full h-full">
              <iframe
                src="/test-resume.pdf#view=FitH"
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold" data-testid="text-dialog-title">
              Choose a template
            </DialogTitle>
            <DialogDescription data-testid="text-dialog-description">
              Select a template to get started with your case study
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {caseStudyTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="flex items-start gap-4 p-4 rounded-xl border-2 border-border hover-elevate text-left transition-all"
                  data-testid={`button-template-${template.id}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${template.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: template.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1" data-testid={`text-template-name-${template.id}`}>
                      {template.name}
                    </h3>
                    <p className="text-sm text-foreground/60" data-testid={`text-template-description-${template.id}`}>
                      {template.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Warning Dialog */}
      <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have made changes to this testimonial. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowUnsavedWarning(false);
                setPendingAction(null);
                setPendingTestimonialId(null);
              }}
              className="rounded-full h-11"
            >
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this project from your portfolio. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Footer Settings Panel */}
      {!isMobileOrTablet && (
        <div 
          className={`fixed right-0 top-0 h-full bg-white border-l border-border transition-transform duration-300 z-40 ${
            isFooterPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '320px' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
              <h2 className="text-lg font-semibold" data-testid="text-footer-panel-title">Footer Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFooterPanelOpen(false)}
                className="h-8 w-8"
                data-testid="button-close-footer-panel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">Resume</Label>
                <div 
                  className="p-8 rounded-[2rem] border-2 border-border/40 bg-white hover-elevate transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-foreground">Update Resume</h4>
                      <p className="text-sm text-foreground/40 mt-1 font-medium">PDF format only • Max 5MB</p>
                    </div>
                    <Button variant="outline" size="lg" className="w-full rounded-full h-12 border-2 border-border/50 bg-white hover:bg-muted/50 font-semibold">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">Contact Info</Label>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="footer-mail" className="text-sm font-medium text-foreground ml-1">Email<span className="text-red-500">*</span></Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input 
                        id="footer-mail" 
                        type="email"
                        defaultValue="rakshit.design@gmail.com" 
                        className="border-0 bg-transparent h-12 px-5 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60"
                        data-testid="input-footer-mail" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer-phone" className="text-sm font-medium text-foreground ml-1">Phone Number<span className="text-red-500">*</span></Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input 
                        id="footer-phone" 
                        type="tel"
                        defaultValue="+1 (206)-571-4546" 
                        className="border-0 bg-transparent h-12 px-5 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60"
                        data-testid="input-footer-phone" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">Links & Socials</Label>
                <div className="space-y-5">
                  {[
                    { id: 'blogs', label: 'Blogs (Medium)', value: 'https://medium.com' },
                    { id: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com' },
                    { id: 'x', label: 'X (Twitter)', value: 'https://x.com' },
                    { id: 'instagram', label: 'Instagram', value: 'https://instagram.com' },
                    { id: 'dribbble', label: 'Dribbble', value: 'https://dribbble.com' }
                  ].map((social) => (
                    <div key={social.id} className="space-y-2">
                      <Label htmlFor={`footer-${social.id}`} className="text-sm font-medium text-foreground ml-1">{social.label}</Label>
                      <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                        <Input 
                          id={`footer-${social.id}`} 
                          type="url"
                          defaultValue={social.value} 
                          className="border-0 bg-transparent h-12 px-5 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60"
                          data-testid={`input-footer-${social.id}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-white sticky bottom-0">
              <Button className="w-full h-11 rounded-full font-semibold">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Footer Panel */}
      {isMobileOrTablet && (
        <Sheet open={isFooterPanelOpen} onOpenChange={setIsFooterPanelOpen}>
          <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
              <h2 className="text-lg font-semibold">Footer Settings</h2>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Reuse the same form content from desktop but adapted for mobile */}
              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Resume</Label>
                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Upload className="w-6 h-6 text-primary" />
                    <h4 className="text-sm font-semibold">Update Resume</h4>
                    <Button variant="outline" size="sm" className="w-full">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Contact Info</Label>
                <Input defaultValue="rakshit.design@gmail.com" placeholder="Email" />
                <Input defaultValue="+1 (206)-571-4546" placeholder="Phone" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Socials</Label>
                <Input defaultValue="https://medium.com" placeholder="Medium" />
                <Input defaultValue="https://linkedin.com" placeholder="LinkedIn" />
                <Input defaultValue="https://x.com" placeholder="X" />
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <Button className="w-full h-11 rounded-full font-semibold">
                Save Changes
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Theme Panel - Desktop (pushes content) - Only on large screens */}
      {!isMobileOrTablet && (
        <div 
          className={`fixed right-0 top-0 h-full bg-white border-l border-border transition-transform duration-300 z-40 ${
            isThemePanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '320px' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
              <h2 className="text-lg font-semibold" data-testid="text-theme-panel-title">Theme Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsThemePanelOpen(false)}
                className="h-8 w-8"
                data-testid="button-close-theme-panel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="layouts" className="w-full h-full flex flex-col">
                <div className="sticky top-0 z-50 bg-white px-6 pt-4 pb-2 border-b border-border/30">
                  <TabsList className="w-full bg-transparent p-0 h-auto gap-6 justify-start">
                    <TabsTrigger 
                      value="layouts" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-layouts"
                    >
                      Layouts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="background" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-background"
                    >
                      Background
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cursors" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-cursors"
                    >
                      Cursors
                    </TabsTrigger>
                    <TabsTrigger 
                      value="fonts" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-fonts"
                    >
                      Fonts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="blocks" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-blocks"
                    >
                      Blocks
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="layouts" className="flex-1 p-6 m-0" data-testid="content-layouts">
                  <div className="space-y-4">
                  </div>
                </TabsContent>
                <TabsContent value="background" className="flex-1 p-6 m-0" data-testid="content-background">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Light Mode</span>
                      </div>
                      <Switch
                        checked={isDarkWallpapers}
                        onCheckedChange={setIsDarkWallpapers}
                        data-testid="switch-wallpaper-mode"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Dark Mode</span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedWallpaper && (
                        <motion.div 
                          key="bg-effects"
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm mb-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Background Texture</span>
                            </div>
                            <div className="flex p-1 bg-muted/50 rounded-lg gap-1 mb-4">
                              <button
                                onClick={() => setBackgroundEffectType('blur')}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                  backgroundEffectType === 'blur'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-foreground/40 hover:text-foreground/70'
                                }`}
                                data-testid="button-effect-blur"
                              >
                                Soft Blur
                              </button>
                              <button
                                onClick={() => setBackgroundEffectType('grain')}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                  backgroundEffectType === 'grain'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-foreground/40 hover:text-foreground/70'
                                }`}
                                data-testid="button-effect-grain"
                              >
                                Fine Grain
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              {backgroundEffectType === 'blur' ? (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium text-foreground/60">Depth</span>
                                    <span className="text-[11px] tabular-nums text-foreground/40">{backgroundBlur}px</span>
                                  </div>
                                  <Slider
                                    value={[backgroundBlur]}
                                    onValueChange={(value) => setBackgroundBlur(value[0])}
                                    max={20}
                                    step={1}
                                    className="w-full"
                                    data-testid="slider-background-blur"
                                  />
                                </div>
                              ) : (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium text-foreground/60">Opacity</span>
                                    <span className="text-[11px] tabular-nums text-foreground/40">{grainIntensity}%</span>
                                  </div>
                                  <Slider
                                    value={[grainIntensity]}
                                    onValueChange={(value) => setGrainIntensity(value[0])}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                    data-testid="slider-grain-intensity"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm mb-4">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Dynamic Motion</span>
                              <p className="text-[11px] text-foreground/40 mt-0.5 font-medium">Parallax zoom interaction</p>
                            </div>
                            <Switch
                              checked={backgroundMotion}
                              onCheckedChange={setBackgroundMotion}
                              data-testid="switch-background-motion"
                              className="scale-90"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 rounded-md border border-border bg-card/50 mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Upload className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1">Upload Custom Background</h4>
                          <p className="text-xs text-foreground/60 mb-2">
                            Upload your own image as background. Recommended ratio: 1920x1080. Maximum file size: 5MB.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="custom-wallpaper-upload"
                            data-testid="input-custom-wallpaper"
                          />
                          <label htmlFor="custom-wallpaper-upload">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => document.getElementById('custom-wallpaper-upload')?.click()}
                              data-testid="button-upload-wallpaper"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedWallpaper(null)}
                        className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                          !selectedWallpaper ? 'border-primary' : 'border-border'
                        }`}
                        data-testid="button-wallpaper-none"
                      >
                        <div className="aspect-video bg-gradient-to-br from-background to-muted flex items-center justify-center">
                          <span className="text-sm font-medium text-foreground/60">Default</span>
                        </div>
                        {!selectedWallpaper && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>

                      {customWallpaper && (
                        <button
                          onClick={() => setSelectedWallpaper(customWallpaper)}
                          className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                            selectedWallpaper === customWallpaper ? 'border-primary' : 'border-border'
                          }`}
                          data-testid="button-wallpaper-custom"
                        >
                          <img 
                            src={customWallpaper} 
                            alt="Custom wallpaper"
                            className="aspect-video object-cover w-full"
                          />
                          {selectedWallpaper === customWallpaper && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="text-xs">Custom</Badge>
                          </div>
                        </button>
                      )}
                      
                      {wallpapers.map((wallpaper) => (
                        <button
                          key={wallpaper.id}
                          onClick={() => setSelectedWallpaper(wallpaper.path)}
                          className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                            selectedWallpaper === wallpaper.path ? 'border-primary' : 'border-border'
                          }`}
                          data-testid={`button-wallpaper-${wallpaper.id}`}
                        >
                          <img 
                            src={wallpaper.path} 
                            alt={wallpaper.name}
                            className="aspect-video object-cover w-full"
                          />
                          {selectedWallpaper === wallpaper.path && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="cursors" className="flex-1 p-6 m-0" data-testid="content-cursors">
                  <div className="space-y-4">
                  </div>
                </TabsContent>
                <TabsContent value="fonts" className="flex-1 p-6 m-0" data-testid="content-fonts">
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/60 mb-4">Choose a global font for your portfolio</p>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(fontOptions).map(([key, font]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedFont(key)}
                          className={`p-4 rounded-md border-2 transition-all hover-elevate text-left ${
                            selectedFont === key ? 'border-primary bg-primary/5' : 'border-border bg-card/50'
                          }`}
                          data-testid={`button-font-${key}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium" style={{ fontFamily: font.family }}>{font.name}</h4>
                              <p className="text-xs text-foreground/60 mt-1" style={{ fontFamily: font.family }}>{font.description}</p>
                            </div>
                            {selectedFont === key && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="blocks" className="flex-1 p-6 m-0" data-testid="content-blocks">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-foreground/60">Re-arrange your portfolio sections</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSectionOrder(['works', 'testimonials', 'toolbox'])}
                        className="h-8 px-2 text-xs gap-1.5 text-foreground/40 hover:text-foreground"
                        data-testid="button-reset-blocks"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </Button>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over && active.id !== over.id) {
                          setSectionOrder((items) => {
                            const oldIndex = items.indexOf(active.id as string);
                            const newIndex = items.indexOf(over.id as string);
                            return arrayMove(items, oldIndex, newIndex);
                          });

                          // Find the section element and scroll to it
                          setTimeout(() => {
                            const sectionElement = document.getElementById(`section-${active.id}`);
                            if (sectionElement) {
                              sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 100);
                        }
                      }}
                    >
                      <SortableContext items={sectionOrder} strategy={rectSortingStrategy}>
                        <div className="space-y-2">
                          {sectionOrder.map((id) => (
                            <SortableSectionItem key={id} id={id} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
      {/* Theme Panel - Mobile/Tablet (popup with overlay) */}
      {isMobileOrTablet && (
        <Sheet open={isThemePanelOpen} onOpenChange={setIsThemePanelOpen}>
          <SheetContent className="w-80 p-0 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
              <h2 className="text-lg font-semibold" data-testid="text-theme-panel-title-mobile">Theme Settings</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="layouts" className="w-full h-full flex flex-col">
                <div className="sticky top-0 z-50 bg-background px-6 pb-2 border-b border-border/30">
                  <TabsList className="w-full bg-transparent p-0 h-auto gap-6 justify-start">
                    <TabsTrigger 
                      value="layouts" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-layouts-mobile"
                    >
                      Layouts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="background" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-background-mobile"
                    >
                      Background
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cursors" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-cursors-mobile"
                    >
                      Cursors
                    </TabsTrigger>
                    <TabsTrigger 
                      value="fonts" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-fonts-mobile"
                    >
                      Fonts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="blocks" 
                      className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground/60 data-[state=active]:text-foreground font-medium transition-all" 
                      data-testid="tab-blocks-mobile"
                    >
                      Blocks
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="layouts" className="flex-1 p-6 m-0" data-testid="content-layouts-mobile">
                  <div className="space-y-4">
                  </div>
                </TabsContent>
                <TabsContent value="background" className="flex-1 p-6 m-0" data-testid="content-background-mobile">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Light Mode</span>
                      </div>
                      <Switch
                        checked={isDarkWallpapers}
                        onCheckedChange={setIsDarkWallpapers}
                        data-testid="switch-wallpaper-mode-mobile"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Dark Mode</span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedWallpaper && (
                        <motion.div 
                          key="bg-effects-mobile"
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm mb-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Background Texture</span>
                            </div>
                            <div className="flex p-1 bg-muted/50 rounded-lg gap-1 mb-4">
                              <button
                                onClick={() => setBackgroundEffectType('blur')}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                  backgroundEffectType === 'blur'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-foreground/40 hover:text-foreground/70'
                                }`}
                                data-testid="button-effect-blur-mobile"
                              >
                                Soft Blur
                              </button>
                              <button
                                onClick={() => setBackgroundEffectType('grain')}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                  backgroundEffectType === 'grain'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-foreground/40 hover:text-foreground/70'
                                }`}
                                data-testid="button-effect-grain-mobile"
                              >
                                Fine Grain
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              {backgroundEffectType === 'blur' ? (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium text-foreground/60">Depth</span>
                                    <span className="text-[11px] tabular-nums text-foreground/40">{backgroundBlur}px</span>
                                  </div>
                                  <Slider
                                    value={[backgroundBlur]}
                                    onValueChange={(value) => setBackgroundBlur(value[0])}
                                    max={20}
                                    step={1}
                                    className="w-full"
                                    data-testid="slider-background-blur-mobile"
                                  />
                                </div>
                              ) : (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium text-foreground/60">Opacity</span>
                                    <span className="text-[11px] tabular-nums text-foreground/40">{grainIntensity}%</span>
                                  </div>
                                  <Slider
                                    value={[grainIntensity]}
                                    onValueChange={(value) => setGrainIntensity(value[0])}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                    data-testid="slider-grain-intensity-mobile"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm mb-4">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Dynamic Motion</span>
                              <p className="text-[11px] text-foreground/40 mt-0.5 font-medium">Parallax zoom interaction</p>
                            </div>
                            <Switch
                              checked={backgroundMotion}
                              onCheckedChange={setBackgroundMotion}
                              data-testid="switch-background-motion-mobile"
                              className="scale-90"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 rounded-md border border-border bg-card/50 mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Upload className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1">Upload Custom Background</h4>
                          <p className="text-xs text-foreground/60 mb-2">
                            Upload your own image as background. Recommended ratio: 1920x1080. Maximum file size: 5MB.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="custom-wallpaper-upload-mobile"
                            data-testid="input-custom-wallpaper-mobile"
                          />
                          <label htmlFor="custom-wallpaper-upload-mobile">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => document.getElementById('custom-wallpaper-upload-mobile')?.click()}
                              data-testid="button-upload-wallpaper-mobile"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <button
                        onClick={() => setSelectedWallpaper(null)}
                        className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                          !selectedWallpaper ? 'border-primary' : 'border-border'
                        }`}
                        data-testid="button-wallpaper-none-mobile"
                      >
                        <div className="aspect-video bg-gradient-to-br from-background to-muted flex items-center justify-center">
                          <span className="text-sm font-medium text-foreground/60">Default</span>
                        </div>
                        {!selectedWallpaper && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>

                      {customWallpaper && (
                        <button
                          onClick={() => setSelectedWallpaper(customWallpaper)}
                          className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                            selectedWallpaper === customWallpaper ? 'border-primary' : 'border-border'
                          }`}
                          data-testid="button-wallpaper-custom-mobile"
                        >
                          <img 
                            src={customWallpaper} 
                            alt="Custom wallpaper"
                            className="aspect-video object-cover w-full"
                          />
                          {selectedWallpaper === customWallpaper && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="text-xs">Custom</Badge>
                          </div>
                        </button>
                      )}
                      
                      {wallpapers.map((wallpaper) => (
                        <button
                          key={wallpaper.id}
                          onClick={() => setSelectedWallpaper(wallpaper.path)}
                          className={`relative rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                            selectedWallpaper === wallpaper.path ? 'border-primary' : 'border-border'
                          }`}
                          data-testid={`button-wallpaper-${wallpaper.id}-mobile`}
                        >
                          <img 
                            src={wallpaper.path} 
                            alt={wallpaper.name}
                            className="aspect-video object-cover w-full"
                          />
                          {selectedWallpaper === wallpaper.path && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="cursors" className="flex-1 p-6 m-0" data-testid="content-cursors-mobile">
                  <div className="space-y-4">
                  </div>
                </TabsContent>
                <TabsContent value="fonts" className="flex-1 p-6 m-0" data-testid="content-fonts-mobile">
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/60 mb-4">Choose a global font for your portfolio</p>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(fontOptions).map(([key, font]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedFont(key)}
                          className={`p-4 rounded-md border-2 transition-all hover-elevate text-left ${
                            selectedFont === key ? 'border-primary bg-primary/5' : 'border-border bg-card/50'
                          }`}
                          data-testid={`button-font-${key}-mobile`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium" style={{ fontFamily: font.family }}>{font.name}</h4>
                              <p className="text-xs text-foreground/60 mt-1" style={{ fontFamily: font.family }}>{font.description}</p>
                            </div>
                            {selectedFont === key && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="blocks" className="flex-1 p-6 m-0" data-testid="content-blocks-mobile">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-foreground/60">Re-arrange your portfolio sections</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSectionOrder(['works', 'testimonials', 'toolbox'])}
                        className="h-8 px-2 text-xs gap-1.5 text-foreground/40 hover:text-foreground"
                        data-testid="button-reset-blocks-mobile"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </Button>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (over && active.id !== over.id) {
                          setSectionOrder((items) => {
                            const oldIndex = items.indexOf(active.id as string);
                            const newIndex = items.indexOf(over.id as string);
                            return arrayMove(items, oldIndex, newIndex);
                          });

                          // Find the section element and scroll to it
                          setTimeout(() => {
                            const sectionElement = document.getElementById(`section-${active.id}`);
                            if (sectionElement) {
                              sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 100);
                        }
                      }}
                    >
                      <SortableContext items={sectionOrder} strategy={rectSortingStrategy}>
                        <div className="space-y-2">
                          {sectionOrder.map((id) => (
                            <SortableSectionItem key={id} id={id} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      )}
      {/* Testimonial Edit Panel - Desktop (pushes content) - Only on large screens */}
      {!isMobileOrTablet && (
        <div 
          className={`fixed right-0 top-0 h-full bg-white border-l border-border transition-transform duration-300 z-40 ${
            isEditTestimonialOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '320px' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
              <h2 className="text-lg font-semibold" data-testid="text-edit-testimonial-title">Edit Testimonial</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAttemptClose('close')}
                className="h-8 w-8"
                data-testid="button-close-edit-testimonial"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-5">
              {editingTestimonial && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-name" className="text-sm font-medium text-foreground">
                      Name of the Person<span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-name"
                        type="text"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        data-testid="input-testimonial-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-linkedin" className="text-sm font-medium text-foreground">
                      LinkedIn Link
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-linkedin"
                        type="url"
                        value={editingTestimonial.linkedinLink || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, linkedinLink: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        placeholder="https://linkedin.com/in/..."
                        data-testid="input-testimonial-linkedin"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-company" className="text-sm font-medium text-foreground">
                      Company Name<span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-company"
                        type="text"
                        value={editingTestimonial.company}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        data-testid="input-testimonial-company"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Testimonial Text
                    </Label>
                    <TiptapEditor
                      content={editingTestimonial.text}
                      onChange={(content) => setEditingTestimonial({ ...editingTestimonial, text: content })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Photo of the Person
                    </Label>
                    <div className="flex justify-start">
                      <label
                        htmlFor="testimonial-avatar"
                        className="relative w-24 h-24 rounded-full border-2 border-border bg-muted hover:border-foreground/30 cursor-pointer flex items-center justify-center transition-all duration-300 ease-out hover:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] overflow-hidden group"
                        data-testid="label-testimonial-avatar"
                      >
                        {editingTestimonial.avatar ? (
                          <>
                            <img
                              src={editingTestimonial.avatar}
                              alt={editingTestimonial.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                          </>
                        ) : (
                          <Upload className="w-6 h-6 text-foreground/40 group-hover:text-foreground/60 transition-colors" />
                        )}
                      </label>
                    </div>
                    <input
                      id="testimonial-avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEditingTestimonial({ ...editingTestimonial, avatar: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      data-testid="input-testimonial-avatar"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t flex gap-2">
              <Button 
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                onClick={() => {
                  setIsEditTestimonialOpen(false);
                  setSelectedTestimonialId(null);
                }}
                data-testid="button-save-testimonial"
              >
                Save
              </Button>
              <Button 
                variant="outline"
                className="flex-1 rounded-full h-11"
                onClick={() => handleAttemptClose('cancel')}
                data-testid="button-cancel-edit-testimonial"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Testimonial Edit Panel - Mobile (Sheet overlay) */}
      {isMobileOrTablet && (
        <Sheet open={isEditTestimonialOpen} onOpenChange={(open) => {
          if (!open) {
            handleAttemptClose('close');
          } else {
            setIsEditTestimonialOpen(open);
          }
        }}>
          <SheetContent className="w-80 p-0 flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold" data-testid="text-edit-testimonial-title-mobile">
                Edit Testimonial
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {editingTestimonial && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-name-mobile" className="text-sm font-medium text-foreground">
                      Name of the Person<span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-name-mobile"
                        type="text"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        data-testid="input-testimonial-name-mobile"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-linkedin-mobile" className="text-sm font-medium text-foreground">
                      LinkedIn Link
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-linkedin-mobile"
                        type="url"
                        value={editingTestimonial.linkedinLink || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, linkedinLink: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        placeholder="https://linkedin.com/in/..."
                        data-testid="input-testimonial-linkedin-mobile"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-company-mobile" className="text-sm font-medium text-foreground">
                      Company Name<span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="testimonial-company-mobile"
                        type="text"
                        value={editingTestimonial.company}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                        className="border-0 bg-transparent h-11 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        data-testid="input-testimonial-company-mobile"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Testimonial Text
                    </Label>
                    <TiptapEditor
                      content={editingTestimonial.text}
                      onChange={(content) => setEditingTestimonial({ ...editingTestimonial, text: content })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Photo of the Person
                    </Label>
                    <div className="flex justify-start">
                      <label
                        htmlFor="testimonial-avatar-mobile"
                        className="relative w-24 h-24 rounded-full border-2 border-border bg-muted hover:border-foreground/30 cursor-pointer flex items-center justify-center transition-all duration-300 ease-out hover:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] overflow-hidden group"
                        data-testid="label-testimonial-avatar-mobile"
                      >
                        {editingTestimonial.avatar ? (
                          <>
                            <img
                              src={editingTestimonial.avatar}
                              alt={editingTestimonial.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                          </>
                        ) : (
                          <Upload className="w-6 h-6 text-foreground/40 group-hover:text-foreground/60 transition-colors" />
                        )}
                      </label>
                    </div>
                    <input
                      id="testimonial-avatar-mobile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEditingTestimonial({ ...editingTestimonial, avatar: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      data-testid="input-testimonial-avatar-mobile"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t flex gap-2">
              <Button 
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                onClick={() => {
                  setIsEditTestimonialOpen(false);
                  setSelectedTestimonialId(null);
                }}
                data-testid="button-save-testimonial-mobile"
              >
                Save
              </Button>
              <Button 
                variant="outline"
                className="flex-1 rounded-full h-11"
                onClick={() => handleAttemptClose('cancel')}
                data-testid="button-cancel-edit-testimonial-mobile"
              >
                Cancel
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
      <div className="hidden sm:block">
        <CourseCard />
      </div>
      
      {/* Floating Dock */}
      <div className="fixed bottom-1 sm:bottom-4 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={[
              { 
                icon: Home, 
                label: "Home", 
                active: activeTab === "home",
                onClick: () => {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } 
              },
              { 
                icon: Layers, 
                label: "Works", 
                active: activeTab === "works",
                onClick: () => {
                  setActiveTab("works");
                  document.getElementById('section-works')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } 
              },
              { 
                icon: MessageSquare, 
                label: "Testimonials", 
                active: activeTab === "feedback",
                onClick: () => {
                  setActiveTab("feedback");
                  document.getElementById('section-testimonials')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } 
              },
              { 
                icon: FileText, 
                label: "Resume", 
                active: isResumeDialogOpen,
                onClick: () => setIsResumeDialogOpen(true) 
              },
              { 
                icon: Mail, 
                label: "Contact", 
                active: activeTab === "contact",
                onClick: () => {
                  setActiveTab("contact");
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                } 
              },
            ]} 
          />
        </div>
      </div>
    </div>
  );
}
