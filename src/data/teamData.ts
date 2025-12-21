// Defines the structure for a single team member object
export interface TeamMember {
  name: string;
  title: string;
  img: string;
  quote?: string;
}

// Defines the structure for a single partner object
export interface Partner {
    name: string;
    logo: string;
}

export const teamMembers: TeamMember[] = [
    { 
        name: "Lion Muhammad Main Uddin", 
        title: "CEO & Founder", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=LM",
        quote: "Healthcare is a right, not a privilege. We're building bridges to ensure every family has access to quality care and a brighter life."
    },
    { 
        name: "S Abdul Motin", 
        title: "Advisor", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=SM",
        quote: "Excellence in operations means excellence in care. Every process we optimize brings us closer to serving our members better."
    },
    { 
        name: "Md Ahosan Ullah", 
        title: "Manager (Hr,Admin)", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=MA",
        quote: "Our story is written by the lives we touch. Marketing isn't just about visibility—it's about connecting hearts with hope."
    },
    { 
        name: "Member Four", 
        title: "Lead Developer", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M4",
        quote: "Technology should be invisible, but its impact should be undeniable. We code with compassion and innovate with purpose."
    },
    { 
        name: "Member Five", 
        title: "Chief Medical Officer", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M5",
        quote: "Every decision we make should pass through the lens of compassion. Healthcare excellence begins with understanding our members' needs."
    },
    { 
        name: "Member Six", 
        title: "Chief Financial Officer", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M6",
        quote: "Financial responsibility means ensuring every taka spent brings maximum value to our members' health and wellbeing."
    },
    { 
        name: "Member Seven", 
        title: "Director of Operations", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M7",
        quote: "Seamless operations create seamless care. Behind every successful treatment is a well-coordinated team working in harmony."
    },
    { 
        name: "Member Eight", 
        title: "Head of Customer Relations", 
        img: "https://placehold.co/400x400/E0E7FF/4338CA?text=M8",
        quote: "Every voice matters, every concern deserves attention. We listen not just to respond, but to truly understand and serve better."
    },
];

const partnerPhotoFiles: string[] = [
    "WhatsApp Image 2025-12-06 at 12.23.40 PM.jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (1).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (2).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (3).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (4).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (5).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (6).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (7).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (8).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (9).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (10).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (11).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (12).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (13).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (14).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (15).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (16).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (17).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (18).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (19).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM (20).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.25 PM.jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.26 PM (1).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.26 PM (2).jpeg",
    "WhatsApp Image 2025-12-06 at 6.43.26 PM.jpeg"
];

export const partners: Partner[] = partnerPhotoFiles.map((fileName, index) => ({
    name: `Hospital Partner ${String(index + 1).padStart(2, '0')}`,
    logo: `/partner-hospital-photos/${fileName}`,
}));
