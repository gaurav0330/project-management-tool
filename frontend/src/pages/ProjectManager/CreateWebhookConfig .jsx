import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Clipboard, Eye, EyeOff, BookAIcon } from 'lucide-react';
import Modal from '../../components/projects/GuideModal'; // Adjust the path if needed
import { useWindowSize } from '../../hooks/useWindowSize'; // Adjust import path to your hook location


// Query: fetch existing project info
const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      githubRepo
      githubWebhookSecret
    }
  }
`;

// Mutation: create webhook config
const CREATE_WEBHOOK_CONFIG = gql`
  mutation CreateWebhookConfig($projectId: ID!, $githubRepo: String!) {
    createWebhookConfig(projectId: $projectId, githubRepo: $githubRepo) {
      url
      secret
    }
  }
`;

const CreateWebhookConfig = () => {
  const { projectId } = useParams();
  const { width } = useWindowSize();
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Query project info
  const { data, loading: loadingQuery } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
    fetchPolicy: 'network-only',
  });

  // Mutation hook
  const [createWebhookConfig, { loading: loadingMutation }] = useMutation(CREATE_WEBHOOK_CONFIG, {
    onCompleted: (data) => {
      setResponse(data.createWebhookConfig);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setResponse(null);
    },
  });

  // If repo and secret exist, set response. If only repo, auto-mutate.
  useEffect(() => {
    if (data?.getProjectById) {
      const { githubRepo, githubWebhookSecret } = data.getProjectById;
      if (githubRepo && githubWebhookSecret) {
        setResponse({ url: githubRepo, secret: githubWebhookSecret });
      } else if (githubRepo && !githubWebhookSecret) {
        createWebhookConfig({
          variables: { projectId, githubRepo },
        });
      }
    }
  }, [data, projectId, createWebhookConfig]);

  // Create button handler
  const handleCreate = () => {
    if (!githubRepoInput) return;
    createWebhookConfig({
      variables: { projectId, githubRepo: githubRepoInput },
    });
  };

  // Copy with toast feedback
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy!'));
  };

  if (loadingQuery) {
    return (
      <div className="text-center p-8 text-txt-secondary-light dark:text-txt-secondary-dark">
        Loading project info...
      </div>
    );
  }

  // Responsive container max widths and paddings
  const containerMaxWidth = width > 1024 ? "max-w-4xl" : width > 768 ? "max-w-3xl" : "max-w-xl";
  const inputPadding = "px-4 py-4";

  return (
    <>
      <div className={`mx-auto p-6 sm:p-8 ${containerMaxWidth} bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-3xl shadow-2xl font-body text-txt-primary-light dark:text-txt-primary-dark border border-bg-accent-light dark:border-bg-accent-dark`}>
        <h1 className="text-4xl font-heading font-bold mb-8 tracking-tight text-heading-primary-light dark:text-heading-primary-dark text-center">
          Webhook Configuration
        </h1>

        {/* Project ID */}
        <div className="mb-8">
          <label
            htmlFor="projectId"
            className="block mb-2 text-sm font-semibold text-txt-secondary-light dark:text-txt-secondary-dark"
          >
            Project ID
          </label>
          <input
            id="projectId"
            type="text"
            value={projectId}
            readOnly
            className={`w-full cursor-not-allowed rounded-lg border border-bg-accent-light dark:border-bg-accent-dark bg-bg-primary-light dark:bg-bg-primary-dark font-mono text-base text-txt-muted-light dark:text-txt-muted-dark shadow-sm focus:outline-none ${inputPadding}`}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mb-6 text-error font-semibold text-center text-base select-none border border-error/20 rounded-lg py-2 bg-error/5">
            {error}
          </p>
        )}

        {response ? (
          <div
            className="space-y-6 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-bg-primary-light dark:border-bg-primary-dark p-6 md:p-8"
            aria-live="polite"
          >
            {/* Webhook URL */}
            <div>
              <label
                htmlFor="webhookUrl"
                className="block mb-2 text-base font-semibold text-heading-accent-light dark:text-heading-accent-dark"
              >
                Webhook URL
              </label>
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow">
                <input
                  id="webhookUrl"
                  type="text"
                  readOnly
                  value={"https://project-management-tool-af4j.onrender.com/api/github/webhook"}
                  className={`flex-grow rounded-t-lg sm:rounded-t-none sm:rounded-l-lg border-0 bg-bg-primary-light dark:bg-bg-primary-dark font-mono text-base text-txt-primary-light dark:text-txt-primary-dark focus:outline-none ${inputPadding}`}
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard("https://project-management-tool-af4j.onrender.com/api/github/webhook")}
                  aria-label="Copy Webhook URL"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-4 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg font-semibold transition-colors duration-200"
                >
                  <Clipboard className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div>
              <label
                htmlFor="webhookSecret"
                className="block mb-2 text-base font-semibold text-heading-accent-light dark:text-heading-accent-dark"
              >
                Secret
              </label>
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow">
                <input
                  id="webhookSecret"
                  type={showSecret ? "text" : "password"}
                  readOnly
                  value={response.secret}
                  className={`flex-grow rounded-t-lg sm:rounded-t-none sm:rounded-l-lg border-0 bg-bg-primary-light dark:bg-bg-primary-dark font-mono text-base text-txt-primary-light dark:text-txt-primary-dark focus:outline-none ${inputPadding}`}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((s) => !s)}
                  aria-label={showSecret ? "Hide Secret" : "Show Secret"}
                  className="px-4 py-4 bg-gray-100 dark:bg-gray-800 border-x border-bg-accent-light dark:border-bg-accent-dark flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(response.secret)}
                  aria-label="Copy Webhook Secret"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-4 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg font-semibold transition-colors duration-200"
                >
                  <Clipboard className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-txt-secondary-light dark:text-txt-secondary-dark select-none mt-2">
              Webhook configuration is already set for this project.
            </div>
          </div>
        ) : (
          <>
            {/* Input + Create */}
            <div className="mb-8">
              <label
                htmlFor="githubRepo"
                className="block mb-2 text-base font-semibold text-txt-secondary-light dark:text-txt-secondary-dark"
              >
                GitHub Repository URL
              </label>
              <input
                id="githubRepo"
                type="text"
                placeholder="https://github.com/username/repo.git"
                value={githubRepoInput}
                onChange={e => setGithubRepoInput(e.target.value)}
                className={`w-full rounded-lg border border-bg-accent-light dark:border-bg-accent-dark bg-bg-primary-light dark:bg-bg-primary-dark font-mono text-base text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${inputPadding}`}
                disabled={loadingMutation}
              />
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loadingMutation || !githubRepoInput}
              className={`w-full py-4 rounded-lg font-button font-semibold mb-6 text-base
                ${
                  loadingMutation || !githubRepoInput
                    ? 'bg-indigo-200 dark:bg-indigo-950 text-indigo-400 dark:text-indigo-600 cursor-not-allowed opacity-60'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white'
                }
                transition-colors duration-200`}
            >
              {loadingMutation ? 'Creating...' : 'Create Webhook Config'}
            </button>
          </>
        )}

        {/* Show Guide button */}
        <div className="mt-2 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="w-full py-3 rounded-lg font-button font-semibold border border-yellow-400 text-yellow-700 dark:text-yellow-200 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-colors duration-200 text-base shadow-sm flex items-center justify-center gap-2"
          >
            <BookAIcon className="w-5 h-5" />
            Show Guide
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="Webhook Configuration Guide">
        <div className="text-sm leading-relaxed mb-6 text-txt-secondary-light dark:text-txt-secondary-dark">
          <p>
            This feature allows you to configure a GitHub webhook for your project. Use the images below as a step-by-step visual guide:
          </p>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <img
                src={`/INTG/INTG-${num}.png`}
                alt={`Step ${num}`}
                className="rounded-lg shadow-md max-w-full max-h-60 object-contain"
                draggable={false}
              />
              <span className="text-xs font-semibold text-txt-primary-light dark:text-txt-primary-dark mt-2">
                Step {num}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default CreateWebhookConfig;
