import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Clipboard } from 'lucide-react';
import Modal from '../../components/projects/GuideModal'; // Make sure this path is correct relative to your file structure

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
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Step 1: Query project info
  const { data, loading: loadingQuery } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
    fetchPolicy: 'network-only',
  });

  // Step 2: Mutation hook
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

  // Step 3: If repo/secret exists, set as response. If only repo, auto-mutate.
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

  // Handle create button click
  const handleCreate = () => {
    if (!githubRepoInput) return;
    createWebhookConfig({
      variables: { projectId, githubRepo: githubRepoInput },
    });
  };

  // Copy function with toast feedback
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy!'));
  };

  if (loadingQuery) {
    return <div className="text-center p-8 text-txt-secondary-light dark:text-txt-secondary-dark">Loading project info...</div>;
  }

  return (
    <>
      <div className="max-w-md mx-auto p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl shadow-lg font-body text-txt-primary-light dark:text-txt-primary-dark">
        <h1 className="text-3xl font-heading font-semibold mb-6 text-heading-primary-light dark:text-heading-primary-dark tracking-tight">
          Webhook Configuration
        </h1>

        {/* Project ID */}
        <div className="mb-6">
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
            className="w-full cursor-not-allowed rounded-md border border-bg-accent-light dark:border-bg-accent-dark bg-bg-primary-light dark:bg-bg-primary-dark px-4 py-3 font-mono text-sm text-txt-muted-light dark:text-txt-muted-dark shadow-sm"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mb-6 text-error font-semibold text-center text-sm select-none">
            {error}
          </p>
        )}

        {/* Show webhook config if exists */}
        {response ? (
          <div
            className="mt-4 space-y-8 bg-bg-accent-light dark:bg-bg-accent-dark rounded-lg border border-bg-primary-light dark:border-bg-primary-dark p-6"
            aria-live="polite"
          >
            {/* Webhook URL */}
            <div>
              <label
                htmlFor="webhookUrl"
                className="block mb-2 text-sm font-semibold text-heading-accent-light dark:text-heading-accent-dark"
              >
                Webhook URL
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  id="webhookUrl"
                  type="text"
                  readOnly
                  value={response.url}
                  className="flex-grow rounded-l-md border border-bg-primary-light dark:border-bg-primary-dark bg-bg-primary-light dark:bg-bg-primary-dark px-4 py-3 font-mono text-sm text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(response.url)}
                  aria-label="Copy Webhook URL"
                  className="flex items-center gap-2 bg-brand-secondary-500 hover:bg-brand-secondary-600 dark:bg-brand-secondary-600 dark:hover:bg-brand-secondary-700 text-bg-primary-light dark:text-bg-primary-dark px-4 py-3 rounded-r-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                >
                  <Clipboard className="w-4 h-4" /> 
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div>
              <label
                htmlFor="webhookSecret"
                className="block mb-2 text-sm font-semibold text-heading-accent-light dark:text-heading-accent-dark"
              >
                Secret
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  id="webhookSecret"
                  type="text"
                  readOnly
                  value={response.secret}
                  className="flex-grow rounded-l-md border border-bg-primary-light dark:border-bg-primary-dark bg-bg-primary-light dark:bg-bg-primary-dark px-4 py-3 font-mono text-sm text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(response.secret)}
                  aria-label="Copy Webhook Secret"
                  className="flex items-center gap-2 bg-brand-secondary-500 hover:bg-brand-secondary-600 dark:bg-brand-secondary-600 dark:hover:bg-brand-secondary-700 text-bg-primary-light dark:text-bg-primary-dark px-4 py-3 rounded-r-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                >
                  <Clipboard className="w-4 h-4" /> 
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-txt-secondary-light dark:text-txt-secondary-dark select-none mt-2">
              Webhook configuration is already set for this project.
            </div>
          </div>
        ) : (
          <>
            {/* Input + Create */}
            <div className="mb-6">
              <label
                htmlFor="githubRepo"
                className="block mb-2 text-sm font-semibold text-txt-secondary-light dark:text-txt-secondary-dark"
              >
                GitHub Repository URL
              </label>
              <input
                id="githubRepo"
                type="text"
                placeholder="https://github.com/username/repo.git"
                value={githubRepoInput}
                onChange={e => setGithubRepoInput(e.target.value)}
                className="w-full rounded-md border border-bg-accent-light dark:border-bg-accent-dark bg-bg-primary-light dark:bg-bg-primary-dark px-4 py-3 font-mono text-sm text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:focus:ring-brand-primary-400"
                disabled={loadingMutation}
              />
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loadingMutation || !githubRepoInput}
              className={`w-full py-3 rounded-md font-button font-semibold mb-4
                ${loadingMutation || !githubRepoInput
                  ? 'bg-interactive-primary-light dark:bg-interactive-primary-dark cursor-not-allowed opacity-60'
                  : 'bg-brand-primary-500 hover:bg-brand-primary-600 dark:bg-brand-primary-400 dark:hover:bg-brand-primary-500 text-bg-primary-light dark:text-bg-primary-dark'}
                transition-colors duration-200`}
            >
              {loadingMutation ? 'Creating...' : 'Create Webhook Config'}
            </button>
          </>
        )}

        {/* Guide button */}
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="mt-2 w-full py-2 rounded-md font-button font-semibold border border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900 transition-colors duration-200"
        >
          Show Guide
        </button>
      </div>

      {/* Modal */}
      <Modal
  isOpen={isGuideOpen}
  onClose={() => setIsGuideOpen(false)}
  title="Webhook Configuration Guide"
>
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
