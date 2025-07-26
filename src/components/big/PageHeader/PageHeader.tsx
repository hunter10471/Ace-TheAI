interface PageHeaderProps {
  title: string;
  subtitle: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  userName = "Rafay Zia", 
  userEmail = "rafay_zia@mail.com", 
  userAvatar = "/assets/avatar.jpg" 
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="font-medium text-gray-900">{userName}</p>
          <p className="text-sm text-gray-600">{userEmail}</p>
        </div>
        <img src={userAvatar} alt="User" className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
} 