import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaComment, FaCheck, FaEye, FaFilter, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Mock data that matches the design in the image
  useEffect(() => {
    const mockQuestions = [
      {
        id: 1,
        title: "How to join 2 columns in a data set to make a separate column in SQL",
        description: "I'd ask how they code this for R, as I am a beginner. So, an example would be helpful. For example, if I have a dataset of first name & last name, I would create a separate column of 'full name' which would combine both columns. It will not have them set side by side only. I want a quick way because my dataset is very large.",
        tags: ["sql", "database"],
        author: {
          username: "User Name",
          avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=user1",
          reputation: 150
        },
        votes: 12,
        answers: 5,
        views: 245,
        createdAt: "2024-01-15T10:30:00Z",
        hasAcceptedAnswer: true,
        isAnswered: true,
        timeAgo: "asked 2 hours ago"
      },
      {
        id: 2,
        title: "Best practices for responsive design with Tailwind CSS",
        description: "Looking for comprehensive guidance on creating responsive layouts with Tailwind CSS. What are the most effective approaches for mobile-first design?",
        tags: ["tailwind-css", "css"],
        author: {
          username: "Another User",
          avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=user2",
          reputation: 320
        },
        votes: 42,
        answers: 15,
        views: 1200,
        createdAt: "2024-01-14T15:45:00Z",
        hasAcceptedAnswer: false,
        isAnswered: true,
        timeAgo: "asked 1 day ago"
      },
      {
        id: 3,
        title: "How to optimize React component re-renders?",
        description: "My React application is experiencing performance issues due to unnecessary re-renders. What are the best optimization techniques?",
        tags: ["react", "performance", "optimization"],
        author: {
          username: "dev_guru",
          avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=guru",
          reputation: 890
        },
        votes: 25,
        answers: 8,
        views: 420,
        createdAt: "2024-01-13T09:15:00Z",
        hasAcceptedAnswer: true,
        isAnswered: true,
        timeAgo: "asked 3 days ago"
      },
      {
        id: 4,
        title: "Setting up CI/CD pipeline with GitHub Actions",
        description: "I need help setting up a continuous integration and deployment pipeline for my Node.js application using GitHub Actions.",
        tags: ["ci-cd", "github", "devops"],
        author: {
          username: "pipeline_pro",
          avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=pipeline",
          reputation: 567
        },
        votes: 15,
        answers: 4,
        views: 350,
        createdAt: "2024-01-12T14:20:00Z",
        hasAcceptedAnswer: false,
        isAnswered: true,
        timeAgo: "asked 1 week ago"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === "" || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = filterTag === "" || question.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "votes":
        return b.votes - a.votes;
      case "answers":
        return b.answers - a.answers;
      case "views":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const allTags = [...new Set(questions.flatMap(q => q.tags))];

  const QuestionCard = ({ question }) => {
    const {
      id,
      title,
      description,
      tags,
      author,
      votes,
      answers,
      views,
      hasAcceptedAnswer,
      timeAgo
    } = question;

    const truncateDescription = (text, maxLength = 200) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    return (
      <div className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
        <div className="flex gap-4">
          {/* Stats Column */}
          <div className="flex flex-col items-end space-y-1 text-sm text-gray-600 min-w-[80px]">
            <div className="flex items-center space-x-1">
              <FaThumbsUp className="w-3 h-3" />
              <span className="font-medium">{votes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComment className="w-3 h-3" />
              <span className="font-medium">{answers}</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="mb-2">
              <Link
                to={`/question/${id}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-lg leading-tight"
              >
                {title}
              </Link>
            </div>

            <div className="mb-3 text-gray-700 text-sm leading-relaxed">
              {truncateDescription(description)}
            </div>

            {/* Tags and Author Info */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <img
                  src={author.avatar}
                  alt={author.username}
                  className="w-4 h-4 rounded-full"
                />
                <Link
                  to={`/user/${author.username}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {author.username}
                </Link>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 mr-8 hidden lg:block">
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                Home
              </Link>
              <Link to="/public" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                Public
              </Link>
              <Link to="/tags" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                Tags
              </Link>
              <Link to="/users" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                Users
              </Link>
            </nav>
          </div>
          
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
            <div className="space-y-2">
              {allTags.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className="block w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {searchQuery ? `Search results for "${searchQuery}"` : "Questions"}
              </h1>
              <p className="text-gray-600 text-sm">
                {sortedQuestions.length} question{sortedQuestions.length !== 1 ? 's' : ''}
              </p>
            </div>
            {user && (
              <Link
                to="/ask"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Ask Question
              </Link>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="votes">Most Votes</option>
                <option value="answers">Most Answers</option>
                <option value="views">Most Views</option>
              </select>
            </div>
            
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            {filterTag && (
              <button
                onClick={() => setFilterTag("")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Questions List */}
          <div className="bg-white border rounded-lg overflow-hidden">
            {sortedQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  {searchQuery ? "No questions found matching your search." : "No questions yet."}
                </div>
                {user && (
                  <Link
                    to="/ask"
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
                  >
                    Ask the First Question
                  </Link>
                )}
              </div>
            ) : (
              <div>
                {sortedQuestions.map((question, index) => (
                  <div key={question.id}>
                    <QuestionCard question={question} />
                    {index < sortedQuestions.length - 1 && (
                      <div className="border-b border-gray-100"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedQuestions.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50">
                  Previous
                </button>
                <span className="px-3 py-2 bg-blue-600 text-white rounded text-sm">1</span>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-blue-600">2</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-blue-600">3</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-blue-600">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
