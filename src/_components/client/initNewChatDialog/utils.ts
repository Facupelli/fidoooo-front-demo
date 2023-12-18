import {
  ComponentFormat,
  type WhatsAppTemplateToSend,
  type WhatsAppMessageTemplate,
  type ParameterToSend,
  type TemplateComponent,
  ComponentType,
} from "@/types/whatsapp";

const createImageComponent = (link: string) => ({
  type: ComponentFormat.IMAGE.toLowerCase(),
  image: { link },
});

const createVideoComponent = (link: string) => ({
  type: ComponentFormat.VIDEO.toLowerCase(),
  video: { link },
});

const createDocumentComponent = (link: string) => ({
  type: ComponentFormat.DOCUMENT.toLowerCase(),
  document: { link },
});

const createHeaderLinkComponent = (
  component: TemplateComponent,
  link: string,
) => {
  switch (component.format) {
    case ComponentFormat.IMAGE:
      return createImageComponent(link);
    case ComponentFormat.VIDEO:
      return createVideoComponent(link);
    case ComponentFormat.DOCUMENT:
      return createDocumentComponent(link);
    default:
      return null;
  }
};

export const variablesToFill = (text: string) => {
  const regex = /\{\{(\d+)\}\}/g;
  const matches = text.match(regex);
  return matches;
};

// TODO: mejorar funcion, chequear "!" operator
export const transformTemplate = (
  template: WhatsAppMessageTemplate,
  templateVariableValues: {
    header: string[];
    body: string[];
  },
) => {
  const newTemplate: WhatsAppTemplateToSend = {
    name: template.name,
    language: {
      code: template.language,
    },
    components: [],
  };

  let headerVariableIndex = 0;
  let bodyVariableIndex = 0;

  for (const component of template.components) {
    if (component.type === ComponentType.HEADER) {
      if (component.text) {
        newTemplate.components.push({
          type: component.type.toLowerCase(),
          parameters: [
            {
              type: "text",
              text: templateVariableValues.header[headerVariableIndex]!,
            },
          ],
        });
      } else {
        newTemplate.components.push({
          type: component.type.toLowerCase(),
          parameters: [
            createHeaderLinkComponent(
              component,
              templateVariableValues.header[headerVariableIndex]!,
            )!,
          ],
        });
      }
      headerVariableIndex++;
    }

    if (component.type === ComponentType.BODY) {
      if (!component.text?.includes("{{")) {
        return;
      }

      const parameters: ParameterToSend[] = [];
      const matches = variablesToFill(component.text);

      if (!matches) {
        return;
      }

      matches.forEach(() => {
        parameters.push({
          type: "text",
          text: templateVariableValues.body[bodyVariableIndex]!,
        });

        bodyVariableIndex++;
      });
      newTemplate.components.push({
        type: component.type.toLowerCase(),
        parameters,
      });
    }
  }

  return newTemplate;
};

export const generateVariablesToFill = (
  template: WhatsAppMessageTemplate | undefined,
) => {
  if (!template) {
    return {};
  }

  const headerVariables: { type: string; name: string }[] = [];
  const bodyVariables: { type: string; name: string }[] = [];

  for (const component of template.components) {
    if (component.type === ComponentType.HEADER && component.format) {
      if (
        component.format === ComponentFormat.TEXT &&
        component.text?.includes("{{")
      ) {
        const headerMatches = variablesToFill(component.text);
        headerMatches?.forEach((match) => {
          headerVariables.push({ type: "header", name: `h-${match}` });
        });
      } else {
        headerVariables.push({
          type: "header",
          name: `${component.format.toLowerCase()} link`,
        });
      }
    }

    if (
      component.type === ComponentType.BODY &&
      component.text?.includes("{{")
    ) {
      const bodyMatches = variablesToFill(component.text);
      bodyMatches?.forEach((match) => {
        bodyVariables.push({ type: "body", name: `b-${match}` });
      });
    }
  }

  return { headerVariables, bodyVariables };
};
